import QrCode from 'qrcode-reader';
import { qrCodeStringToObject } from './utils/qrcode';

self.onmessage = event => {
  console.log(event.data);
  // BEGIN MAIN THREAD SOLUTION
  let qr = new QrCode();
  let imageBuffer = event.data;
  qr.callback = function(error, rawResult) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    self.postMessage(result);
  }
  qr.decode(imageBuffer);
  // END MAIN THREAD SOLUTION
}