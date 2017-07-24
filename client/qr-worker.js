import QrCode from 'qrcode-reader';

self.onmessage = ({ data }) => {
  let qr = new QrCode();
  qr.callback = function(error, rawResult) {
    if(error) {
      self.postMessage({ error });
      return;
    }
    let [id, name, category, imageUrl, price, unit] = rawResult.result.split(',');
    self.postMessage({ result: {
      id,
      name,
      category,
      imageUrl,
      unit,
      price: parseFloat(price)
    }});
  }
  qr.decode(data);
}