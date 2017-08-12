let counts = {
  install: 0,
  activate: 0,
  fetch: 0
};

self.addEventListener('install', () => {
  console.log('install: ', counts.install++);
});
self.addEventListener('activate', () => {
  console.log('activate: ', counts.activate++);
});
self.addEventListener('fetch', () => {
  console.log('fetch: ', counts.fetch++);
});