const Db = require('./db');
const csvParse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const https = require('https');

const db = new Db();

function dasherize(str) {
  return str.toLowerCase()
    .replace(/[^w]+/g, '-');
}

async function seedDb() {
  await db.start();

  let contents = fs.readFileSync(path.join(__dirname, 'seeds.csv'));
  let id = 0;

  const GroceryItem = db.models['grocery-item'];
  await GroceryItem.sync({ force: true });

  csvParse(contents, (err, items) => {

    items.forEach((item) => {
      let [name, category, price, imageUrl] = item;
      id++;
      var file = fs.createWriteStream(path.join(__dirname, '..', 'images', `${id}.jpg`));
      https.get(imageUrl, (response) => {
        response.pipe(file);
        return GroceryItem.create({
          name,
          category,
          price,
          imageUrl: `${id}.jpg`
        });
      });
    });
  });
}

seedDb();