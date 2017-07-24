import QrCode from 'qrcode-reader';
import {
  qrCodeStringToObject
} from './utils/qrcode';

self.onmessage = ({ data }) => {
  let qr = new QrCode();
  qr.callback = function(error, rawResult) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    self.postMessage({ result });
  }
  qr.decode(data);
}