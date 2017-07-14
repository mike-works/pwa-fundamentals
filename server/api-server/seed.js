const Db = require('./db');
const csvParse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const https = require('https');

const db = new Db();

const PRICE_REGEX = /\$([0-9]+.[0-9]{0,2})/;

function processPrice(rawPrice) {
  let [, unitPrice] = PRICE_REGEX.exec(rawPrice);
  let unit = rawPrice.replace(unitPrice, '').replace(/[^A-Za-z]/g, '').trim();
  return { unitPrice: parseFloat(unitPrice), unit };
}

async function seedDb() {
  await db.start();

  let contents = fs.readFileSync(path.join(__dirname, 'seeds.csv'));

  const GroceryItem = db.models['grocery-item'];
  await GroceryItem.sync({ force: false });

  csvParse(contents, (err, items) => {
    items.forEach((item, idx) => {
      let [name, category, price, imageUrl] = item;
      https.get(imageUrl, (response) => {
        var file = fs.createWriteStream(path.join(__dirname, '..', 'images', `${idx+1}.jpg`));
        response.pipe(file);
        let {unit, unitPrice} = processPrice(price);
        return GroceryItem.create({
          name,
          category,
          price: unitPrice,
          unit,
          imageUrl: `/images/${idx+1}.jpg`
        });
      });
    });
  });
}

seedDb();