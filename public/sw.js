const CACHE_NAME = "managex-v1"
const urlsToCache = ["/", "/dashboard", "/notes", "/analytics", "/settings", "/manifest.json"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Handle background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Sync data when back online
      console.log("Background sync triggered"),
    )
  }
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from Managex",
    icon: "/icon-192.jpg",
    badge: "/icon-192.jpg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/icon-192.jpg",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192.jpg",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Managex", options))
})
