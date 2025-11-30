const CACHE_NAME = "todo-cache-v3";
const RUNTIME_CACHE = "runtime-cache-v3";

const PRECACHE_ASSETS = [
    "./",
    "./index-mobile.html",
    "./offline.html",
    "./manifest.json",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap",
    "https://i.postimg.cc/rs5C8Hs9/todolisticon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

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

self.addEventListener("fetch", event => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin.includes("fonts.googleapis.com") ||
        url.origin.includes("fonts.gstatic.com")) {
        event.respondWith(cacheFirst(req));
        return;
    }

    if (url.href.includes("cdnjs") || url.href.includes("postimg") ||
        /\.(png|jpg|jpeg|gif|svg|webp)$/.test(url.pathname)) {
        event.respondWith(cacheFirst(req));
        return;
    }

    if (req.headers.get("accept")?.includes("text/html")) {
        event.respondWith(networkFirst(req));
        return;
    }

    event.respondWith(cacheFirst(req));
});

// -----------------

async function networkFirst(req) {
    try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
    } catch {
        return caches.match(req) ||
               caches.match("./offline.html");
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
        return caches.match("./offline.html");
    }
}