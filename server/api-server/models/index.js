let fs = require('fs');
let path = require('path');
let Sequelize = require('sequelize');

module.exports = function (sequelize) {

  let db = {};

  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
      let model = sequelize.import(path.join(__dirname, file))(sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
}