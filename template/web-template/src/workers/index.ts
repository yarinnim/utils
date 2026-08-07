self.addEventListener('install', () => {
  console.log('Service worker installed');
});

self.addEventListener('activate', () => {
  console.log('Service worker activated');
});

self.addEventListener('offline', () => {
  console.log('offline');
});

self.addEventListener('online', () => {
  console.log('back to online');
});
