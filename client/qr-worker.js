import QrCode from 'qrcode-reader';
import { qrCodeStringToObject } from './utils/qrcode.js';

self.onmessage = event => {
  console.log(event.data);
  let imageBuffer = event.data;
  let qr = new QrCode();
  qr.callback = function(error, rawResult) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    self.postMessage({ data: result });
  }
  qr.decode(imageBuffer);
}