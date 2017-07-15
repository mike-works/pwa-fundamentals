/* eslint no-console: 0*/
const CACHE_VERSION = 25;
const CACHE_KEY = `FEG-v${CACHE_VERSION}`;
const CACHE_NAME = (name) => `${CACHE_KEY}-${name}`;

const ALL_CACHES = {
  prefetch: CACHE_NAME('PREFETCH'),
  fallback: CACHE_NAME('FALLBACK')
};

const ALL_CACHES_LIST = Object.keys(ALL_CACHES).map((k) => ALL_CACHES[k]);

const ASSET_MANIFEST_URL = `${self.location.protocol}//${self.location.host}/asset-manifest.json`;

/// PREFETCH CACHE ///
const PREFETCH_WHITELIST = ['app.js', 'web-app-manifest.json', /^img\/[\w0-9\-_]+.(png|jpg|gif|bmp)$/];
const PREFETCH_BLACKLIST = [];

function isRegex(x) {
  return typeof x === 'object' && !!x.test && !!x.exec;
}

function doesFilenameMatchPrefetchFilter(fileName, filter) {
  if (typeof filter === 'string') {
    return filter.toLowerCase() === fileName.toLowerCase();
  } else if (isRegex(filter)) {
    return filter.test(fileName);
  } else {
    console.error('SW: Unexpected type in prefetch filter list!', filter);
  }
}

export function handleIfPrecached(request) {
  return self.caches.match(request, { cacheName: ALL_CACHES.prefetch }).then((r) => {
    if (!r){
      throw `Did not match anything in precache ${ request.url}`;
    }
    return r;
  })
}

export function fetchWithCacheFallback(request, timeout) {
  return new Promise((resolve, reject) => {
    let t = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(t);
      caches.open(ALL_CACHES.fallback).then((cache) => {
        console.log('adding to cache ', request.url);
        cache.add(request.url, response);
        resolve(response);
      });
    }, reject) 
  }).catch(() => {
    return caches.open(ALL_CACHES.fallback).then((cache) => {
      return cache.match(request).then((match) => {
        return match || fetch(request);
      }).catch(() => {
        return fetch(request);
      })
    })
  });
}

function _shouldPrefetchFile(fileName) {
  for (let i = 0; i < PREFETCH_BLACKLIST.length; i++) {
    if (doesFilenameMatchPrefetchFilter(fileName, PREFETCH_BLACKLIST[i])) {
      return false;
    }
  }
  for (let i = 0; i < PREFETCH_WHITELIST.length; i++) {
    if (doesFilenameMatchPrefetchFilter(fileName, PREFETCH_WHITELIST[i])) {
      return true;
    }
  }
  return false;
}

export function prefetchStaticAssets() {
  return caches.open(ALL_CACHES.prefetch)
    .then((cache) => {
      console.info('Retrieving asset manifest: ', ASSET_MANIFEST_URL);
      return fetch(ASSET_MANIFEST_URL)
        .then(response => response.json())
        .then((m) => {
          console.log('Asset Manfest is: ', m);
          let toCache = Object.keys(m)
            .filter(_shouldPrefetchFile)
            .map((k) => m[k]);
          toCache.push('/');
          return cache.addAll(toCache).then((x) => {
            console.log('Precache complete');
            return x;
          });
        });
    });
}

export function cleanUnusedCaches() {
  return caches.keys().then((cacheNames) => {
    let toDelete = cacheNames
      .reduce((list, thisCache) => {
        if (ALL_CACHES_LIST.indexOf(thisCache) === -1) {
          return list.concat(thisCache);
        } else {
          return list;
        }
      }, []);
    if (toDelete.length > 0) {
      // eslint-disable-next-line
      console.log('SW: Deleting old caches', toDelete);
      return Promise.all(toDelete.map((c) => caches.delete(c)));
    } else {
      return Promise.resolve();
    }
  });
}
