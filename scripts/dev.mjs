import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import worker from '../src/worker.mjs';
const root=resolve('public');
const types={'.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
const env={ASSETS:{async fetch(request){
  const pathname=decodeURIComponent(new URL(request.url).pathname);
  const file=resolve(root,'.'+pathname);
  if(!file.startsWith(root+sep)) return new Response('Not found',{status:404});
  try{return new Response(await readFile(file),{headers:{'Content-Type':types[extname(file)]||'application/octet-stream'}})}catch{return new Response('Not found',{status:404})}
}}};
http.createServer(async(req,res)=>{
  try{const response=await worker.fetch(new Request(`http://${req.headers.host}${req.url}`,{method:req.method}),env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){console.error(error);res.writeHead(500);res.end('Server error');}
}).listen(4173,'127.0.0.1',()=>console.log('JSC ready: http://127.0.0.1:4173'));
