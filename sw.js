// Cache-first app shell so the quest loop still works offline-ish once
// visited. Content is entirely client-side (no API calls), so this is a
// simple shell cache, not a data-sync worker. Bump CACHE_NAME on any
// asset change to force a refresh.
const CACHE_NAME = "discovery-quest-v23";
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/config.js",
  "./js/i18n.js",
  "./js/data.js",
  "./js/rocket.js",
  "./js/questions-i18n.js",
  "./js/storage.js",
  "./js/achievements.js",
  "./js/engine.js",
  "./js/dashboard.js",
  "./js/cloud.js",
  "./js/grading.js",
  "./js/push.js",
  "./js/sound.js",
  "./js/app.js",
  "./icons/mascot.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

// Daily reminder delivery — the actual "send" happens server-side (see
// docs/PUSH_REMINDERS_SETUP.md), this just displays whatever payload
// arrives and routes a tap back into the app.
self.addEventListener("push", (event) => {
  let data = { title: "Rocket Lab", body: "Ready to get silly good at something today?" };
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      tag: "daily-reminder",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
});
