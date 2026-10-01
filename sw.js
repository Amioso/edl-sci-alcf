const C = "edl-sci-alcf-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  let u; try { u = new URL(e.request.url); } catch (_) { return; }
  if (u.hostname.indexOf("script.google") !== -1 || u.hostname.indexOf("googleusercontent") !== -1) return;
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.status === 200 && u.origin === location.origin) {
        const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)).catch(() => {});
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
