import QrCode from 'qrcode-reader';
import { qrCodeStringToObject } from './utils/qrcode';

console.log("I'm working already!");
self.onmessage = ({ data: msg }) => {
  let imageBuffer = msg.buffer;
  if (!imageBuffer) throw new Error('I got no imageBuffer');
  doWork(imageBuffer);
}

function doWork(imageBuffer) {
  let qr = new QrCode();
  qr.callback = function(error, rawResult) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    // resolve();
    self.postMessage(result);
  }
  qr.decode(imageBuffer);
}