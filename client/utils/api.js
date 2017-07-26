let apiEndpoint = new URL(document.head.querySelector('meta[name="fegrocer-api-endpoint"]').content);
apiEndpoint.protocol = window.location.protocol;

export const endpoint = apiEndpoint.toString();