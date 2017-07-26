let metaContents = document.head.querySelector('meta[name="fegrocer-api-endpoint"]').content;
let apiEndpoint = new URL(metaContents);
apiEndpoint.protocol = window.location.protocol;

export const endpoint = apiEndpoint.toString();