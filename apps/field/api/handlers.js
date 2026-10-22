'use strict';
const {coordinates,createWeatherCache}=require('./lib/cache');
const database=require('./lib/database');
const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
exports.health=async()=>{try{const col=await database.collection();await col.findOne({_id:'gate'},{projection:{_id:1}});return{status:200,headers,jsonBody:{status:'ok',service:'field-weather',cache:'shared'}};}catch{return{status:503,headers,jsonBody:{status:'unavailable',service:'field-weather'}};}};
exports.weather=async request=>{
  let key;try{key=coordinates(new URL(request.url).searchParams);}catch{return{status:400,headers,jsonBody:{error:'Use valid latitude and longitude.'}};}
  try{const col=await database.collection();const body=await createWeatherCache(col)(key);return{status:200,headers,jsonBody:body};}
  catch(error){const status=[400,429,502].includes(error.status)?error.status:503;return{status,headers:{...headers,...(status===429?{'Retry-After':'60'}:{})},jsonBody:{error:status===429?'Weather is temporarily rate limited. Please wait a minute.':'Weather is temporarily unavailable. Please try later.'}};}
};
