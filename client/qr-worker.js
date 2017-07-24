import QrCode from 'qrcode-reader';

self.onmessage = ({ data }) => {
  let qr = new QrCode();
  qr.callback = function(error, result) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    self.postMessage({result: result.result});
  }
  qr.decode(data);
}