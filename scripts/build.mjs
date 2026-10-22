import {mkdir,cp,rm,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
// Explicit allowlist: only these two client-only tools are public Pages artifacts.
for(const name of ['index.html','meme-press','still'])await cp(name,`dist/${name}`,{recursive:true});
await writeFile('dist/.nojekyll','');
console.log('Built two static projects. No server code, credentials, or private files included.');
