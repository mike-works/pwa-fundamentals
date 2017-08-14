import QrCode from 'qrcode-reader';
import { qrCodeStringToObject } from './utils/qrcode';

self.onmessage = (messageEvent) => {
  let { data: imageBuffer } = messageEvent; // the imageBuffer

  let qr = new QrCode();
  qr.callback = function (error, rawResult) {
    if (error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    self.postMessage({ decoded: result });
  }
  qr.decode(imageBuffer);
}