/* FIXED & IMPROVED SERVICE WORKER */

const CACHE_NAME = "todo-cache-v5";
const RUNTIME_CACHE = "runtime-cache-v5";

/* Explicit local assets — do NOT use "./" */
const PRECACHE_ASSETS = [
    "/index-mobile.html",
    "/notepad.html",
    "/editor.html",
    "/split.html",
    "/offline.html",
    "/manifest.json",
    "https://i.postimg.cc/rs5C8Hs9/todolisticon.png",
    // Optional: add local icons if you have them
    // "/icons/icon-192.png",
    // "/icons/icon-512.png"
];

/* INSTALL — safe precache (avoid failing on external fonts) */
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const url of PRECACHE_ASSETS) {
                try {
                    const res = await fetch(url, { cache: "reload" });
                    if (res.ok) cache.put(url, res.clone());
                } catch (err) {
                    console.warn("Precache failed for:", url, err);
                }
            }
        })
    );

    self.skipWaiting();
});

/* ACTIVATE — remove older caches */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE)
                    .map(k => caches.delete(k))
            )
        )
    );

    self.clients.claim();
});

/* FETCH HANDLER WITH FIXED LOGIC */
self.addEventListener("fetch", event => {
    const req = event.request;
    const url = new URL(req.url);

    // GOOGLE FONTS: runtime cache only
    if (url.origin.includes("fonts.googleapis.com") ||
        url.origin.includes("fonts.gstatic.com")) {
        event.respondWith(cacheFirst(req));
        return;
    }

    // CDN images/CSS
    if (url.href.includes("cdnjs") ||
        url.href.includes("postimg") ||
        /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)) {
        event.respondWith(cacheFirst(req));
        return;
    }

    // HTML requests — networkFirst for updated UI
    if (req.headers.get("accept")?.includes("text/html")) {
        event.respondWith(networkFirst(req));
        return;
    }

    // Everything else → cacheFirst
    event.respondWith(cacheFirst(req));
});

/* STRATEGIES */
async function networkFirst(req) {
    try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
    } catch {
        return caches.match(req) || caches.match("/offline.html");
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(req);
    if (cached) return cached;

    try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch {
        return caches.match("/offline.html");
    }
}