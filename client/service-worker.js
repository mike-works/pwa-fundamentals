const counts = {
  install: 0,
  activate: 0,
  fetch: 0
};

self.addEventListener('install', installEvt => {
  console.log('install', counts.install++);
});

self.addEventListener('activate', activateEvt => {
  console.log('activate', counts.activate++);
});

self.addEventListener('fetch', fetchEvt => {
  console.log('fetch', counts.fetch++);
});