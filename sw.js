const PREFIX='csp-ajmal-'+encodeURIComponent(new URL('./',self.location.href).pathname)+'-';
const CACHE=PREFIX+'v4-rounds-20261004';
const BASE=new URL('./',self.location.href).pathname;
const cached=request=>caches.open(CACHE).then(cache=>cache.match(request));
const CORE=['./','./index.html','./style.css','./app.js','./engine.js','./questions.js','./favicon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png','./QUALITY_REPORT.html'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(BASE))return;
if(event.request.mode==='navigate'&&!u.pathname.endsWith('.pdf')){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));}return response;}).catch(async()=>await cached(event.request)||await cached('./index.html')));return;}
event.respondWith(cached(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok&&response.status===200){const clone=response.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));}return response;})));});
