'use strict';
const {createHash}=require('node:crypto');
const MAX_AGE=96*60*60*1000;
const USER_AGENT='FieldWeatherPortfolioDemo/1.0 (https://github.com/GrimSyntaxCloud/javascript-showcase; https://grimsyntaxcloud.github.io/)';
function coordinates(search){const lat=search.get('lat'),lon=search.get('lon');if(lat===null||lon===null||!/^[-+]?\d+(\.\d+)?$/.test(lat)||!/^[-+]?\d+(\.\d+)?$/.test(lon)||Math.abs(Number(lat))>90||Math.abs(Number(lon))>180)throw Object.assign(Error('Invalid coordinates.'),{status:400});return`${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;}
function cacheIdentity(key){const hash=createHash('sha256').update(key).digest('hex');return {id:`slot-${parseInt(hash.slice(0,8),16)%64}`,keyHash:hash};}
function problem(status,message){return Object.assign(Error(message),{status});}
function createWeatherCache(collection,{now=Date.now,fetcher=fetch}={}){
  return async function weather(key){
    const time=now(),identity=cacheIdentity(key);
    const old=await collection.findOne({_id:identity.id,keyHash:identity.keyHash});
    if(old?.body&&old.providerExpiresAt>new Date(time)&&old.expiresAt>new Date(time))return old.body;
    try{await collection.updateOne({_id:'gate'},{$setOnInsert:{nextAllowedAt:new Date(0),blockedUntil:new Date(0),expiresAt:new Date(time+MAX_AGE)}},{upsert:true});}catch(error){if(error.code!==11000)throw error;}
    // Atomic Mongo condition makes the limit global across all managed API instances.
    const gate=await collection.findOneAndUpdate({_id:'gate',nextAllowedAt:{$lte:new Date(time)},blockedUntil:{$lte:new Date(time)}},{$set:{nextAllowedAt:new Date(time+1500),expiresAt:new Date(time+MAX_AGE)}},{returnDocument:'after'});
    if(!gate)throw problem(429,'Weather requests are temporarily limited. Please try again shortly.');
    const [lat,lon]=key.split(','),headers={'User-Agent':USER_AGENT};
    if(old?.modified&&old.expiresAt>new Date(time))headers['If-Modified-Since']=old.modified;
    let response;
    try{response=await fetcher(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,{headers,signal:AbortSignal.timeout(15000)});}catch{throw problem(502,'Weather is unavailable right now. Please try later.');}
    if(response.status===403||response.status===429){const retry=response.headers.get('retry-after'),retryAt=retry&&/^\d+$/.test(retry)?now()+Number(retry)*1000:Date.parse(retry);const until=Math.max(now()+60000,Number.isFinite(retryAt)?Math.min(retryAt,now()+MAX_AGE):0);await collection.updateOne({_id:'gate'},{$max:{blockedUntil:new Date(until)}});throw problem(429,'The weather provider is temporarily limiting requests. Please try later.');}
    if(!response.ok&&response.status!==304)throw problem(502,'Weather is unavailable right now. Please try later.');
    let body;
    if(response.status===304){body=old?.body;}else{
      const raw=await response.json();
      if(!Array.isArray(raw?.properties?.timeseries)||!raw.properties.timeseries.length)throw problem(502,'The weather provider returned no forecast.');
      // Do not store provider geometry/coordinates or the caller's address. Only model weather.
      body={properties:{meta:raw.properties.meta,timeseries:raw.properties.timeseries}};
    }
    if(!body)throw problem(502,'The weather provider returned no forecast.');
    const writtenAt=now(),expiry=Date.parse(response.headers.get('expires'));
    const providerExpiresAt=new Date(Number.isFinite(expiry)&&expiry>writtenAt?Math.min(expiry,writtenAt+MAX_AGE):writtenAt+600000);
    const doc={_id:identity.id,keyHash:identity.keyHash,body,providerExpiresAt,expiresAt:new Date(writtenAt+MAX_AGE),modified:response.headers.get('last-modified')||old?.modified||null};
    try{await collection.replaceOne({_id:identity.id},doc,{upsert:true});}catch(error){if(error.code!==11000)throw error;await collection.replaceOne({_id:identity.id},doc);}
    return body;
  };
}
module.exports={coordinates,cacheIdentity,createWeatherCache,MAX_AGE,USER_AGENT};
