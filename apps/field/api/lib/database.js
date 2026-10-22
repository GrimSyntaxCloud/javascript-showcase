'use strict';
const {MongoClient}=require('mongodb');
let connection;
async function collection(){
  if(!process.env.MONGODB_URI)throw Error('Weather cache is not configured.');
  if(!connection){const client=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:3,retryWrites:false,serverSelectionTimeoutMS:8000});connection=client.connect().then(()=>client).catch(error=>{connection=undefined;throw error;});}
  const client=await connection;
  return client.db(process.env.MONGODB_DATABASE||'portfolio-demos').collection(process.env.MONGODB_COLLECTION||'field_cache');
}
module.exports={collection};
