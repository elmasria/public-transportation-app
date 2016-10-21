'use strict';
var staticCacheName = 'public-transportation-app-static-v0',
allCaches = [
staticCacheName
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function (cache) {
			return cache.addAll([
				'index.html',
				'js/app.min.js',
				'css/app.min.css',
				'images/favicon.ico'
				]);
		})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cacheName.startsWith('public-transportation-app') &&
					!allCaches.includes(cacheName);
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				})
				);
		})
	);
});

self.addEventListener('fetch', function (event) {
	var requestUrl = new URL(event.request.url);
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		}));
});

self.addEventListener('message', function (event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});
