import {cp,mkdir,rm} from 'node:fs/promises';
const app=process.argv[2];
if(!['interval','field'].includes(app))throw Error('Choose interval or field.');
const output=`release/${app}`;
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
await cp(`apps/${app}/site`,`${output}/site`,{recursive:true});
await cp(`apps/${app}/api`,`${output}/api`,{recursive:true,filter:path=>!path.includes('/test/')&&!path.endsWith('/test')});
console.log(`Packaged ${app}: static files plus a managed Node 22 API.`);
