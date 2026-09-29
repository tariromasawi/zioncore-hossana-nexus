const CACHE = "hossana-nexus-77";
const ASSETS = ["/", "/index.html", "/css/nexus.css", "/js/app.js", "/js/oracle-engine.js", "/js/oracle-worker.js", "/js/matrix-worker.js"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match("/"))));
});
