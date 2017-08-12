import QrCode from 'qrcode-reader';
import { qrCodeStringToObject } from './utils/qrcode';

self.onmessage = evt => {
  let imageBuffer = evt.data;

  // Decode the QR code
  let qr = new QrCode();
  qr.callback = function(error, rawResult) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    self.postMessage({data: result});
  }
  qr.decode(imageBuffer);
}