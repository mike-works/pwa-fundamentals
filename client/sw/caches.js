const CACHE_VERSION = 3;
const CACHE_PREFIX = `FEG-v${CACHE_VERSION}`;

export const ALL_CACHES = {
  fallbackImages: cacheName('FALLBACK_IMAGES'),
  prefetch: cacheName('PREFETCH'),
  fallback: cacheName('FALLBACK')
};

function cacheName(name) {
  return `${CACHE_PREFIX}-${name}`;
}

export const ALL_CACHES_LIST = Object
  .keys(ALL_CACHES)
  .map((k) => ALL_CACHES[k]);

/**
 * Delete all caches other than those whose names are
 * provided in a list
 * 
 * @public
 * @param {string[]} cacheNamesToKeep names of caches to keep
 * @return {Promise}
 */
export function removeUnusedCaches(cacheNamesToKeep) {
  return caches.keys().then((cacheNames) => {
    let toDelete = cacheNames.reduce((list, thisCache) => {
      if (cacheNamesToKeep.indexOf(thisCache) === -1)
        return list.concat(thisCache);
      return list;
    }, []);
    if (toDelete.length > 0) {
      console.log('SW: Deleting old caches', toDelete);
      return Promise.all(toDelete.map((c) => caches.delete(c)));
    } else {
      return Promise.resolve();
    }
  });
}

////////////////////
// PREFETCH CACHE //
////////////////////
const ASSET_MANIFEST_URL = `${self.location.protocol}//${self.location.host}/asset-manifest.json`;
const RESOURCES_TO_PRECACHE = [
  /^app\.js$/,
  /^app\.css$/,
  /^web-app-manifest\.json$/,
 /^img\/[\w0-9\-_]+.(png|jpg|gif|bmp)$/,
 /^apple-touch-icon-[\w0-9\-_]+.(png|jpg|gif|bmp)$/
];

/**
 * Check whether a given filename represents a resource
 * that should be precached
 * 
 * @private
 * @param {string} fileName 
 * @return {boolean}
 */
function _shouldPrecacheFile(fileName) {
  for (let i = 0; i < RESOURCES_TO_PRECACHE.length; i++)
    if (RESOURCES_TO_PRECACHE[i].test(fileName)) return true;
  return false;
}

export function precacheStaticAssets() {
  return fetch(ASSET_MANIFEST_URL)
    .then((response) =>  response.json())
    .then((assetManifestJson) => {

      let urls =
        // Get all the keys from the json asset manifest
        Object.keys(assetManifestJson)
        // filter for only those keys we should prefetch
        .filter(_shouldPrecacheFile)
        // get the values out of the asset manifest for the (filtered) keys
        .map(k => assetManifestJson[k])
      // Open the "prefetch" cache,
      
      console.log('TO PREFETCH', urls);
      return caches.open(ALL_CACHES.prefetch)
        // and add all urls that are appropriate
        .then(cache => cache.addAll(urls.map(u => `/${u}`)));
    });
}
