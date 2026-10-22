'use strict';
const headers = {'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
exports.health = async () => ({status:200,headers,jsonBody:{status:'ok',service:'interval',persistentRegistrations:false}});
exports.statistics = async () => ({status:200,headers,jsonBody:(await import('./lib/core.mjs')).statistics});
exports.registration = async request => {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return {status:415,headers,jsonBody:{error:'Use JSON.'}};
  const text = await request.text();
  if (Buffer.byteLength(text,'utf8')>16384) return {status:413,headers,jsonBody:{error:'Request too large.'}};
  let data;
  try { data=JSON.parse(text); } catch { return {status:400,headers,jsonBody:{error:'Invalid JSON.'}}; }
  const {validateRegistration}=await import('./lib/core.mjs');
  if (!validateRegistration(data)) return {status:400,headers,jsonBody:{error:'Please check the form details.'}};
  // Intentionally discard all submitted details: no account, email, database or real booking.
  return {status:200,headers,jsonBody:{message:`Demo complete, ${data.username.trim()}. Your details were validated and discarded. No real registration was created.`}};
};
