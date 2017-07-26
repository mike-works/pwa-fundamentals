import QrCode from 'qrcode-reader';

export function qrCodeStringToObject(str) {
  let [id, name, category, imageUrl, price, unit] = str.split(',');
  return {
    id,
    name,
    category,
    imageUrl,
    unit,
    price: parseFloat(price)
  }
}

export function fileToImageBuffer(file) {
  return new Promise((resolve /*, reject*/) => {
    var imageType = /^image\//;
    if (!imageType.test(file.type)) {
      throw new Error('File type not valid');
    }
    // Read file
    var reader = new FileReader();
    reader.addEventListener('load', () => {
      let img = new Image();
      let canvas = document.createElement('canvas');
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0);
        let data = ctx.getImageData(0, 0, img.width, img.height);
        resolve(data);
      }
      img.src = event.target.result;
    }, false);


    reader.readAsDataURL(file);
  });
}

export function onQrCodeScan(imageBuffer, cartStore) {
  return new Promise((resolve/*, reject*/) => {

    // MAIN THREAD SOLUTION
    let qr = new QrCode();
    qr.callback = function(error, rawResult) {
      if(error) {
        self.postMessage({ error });
        return;
      }
      let result = qrCodeStringToObject(rawResult.result);
      resolve(result);
    }
    qr.decode(imageBuffer);
  }).then((qrData) => {
    cartStore.addItemToCart(qrData);
  });
}