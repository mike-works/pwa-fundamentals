const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const dbModels = require('./models');
const debug = require('debug')('db');

const PROJECT_ROOT_PATH = path.join(__dirname, '..', '..');

function dbPath(name) {
  return path.join(PROJECT_ROOT_PATH, 'db', `${name}.sqlite`);
}

function openDb(name) {
  let databasePath = dbPath(name);
  process.stdout.write(chalk.yellow(`📂  Opening database ${databasePath}`));
  return new Promise((resolve, reject) => {
    fs.exists(databasePath, (itExists) => {
      if (!itExists) {
        reject(`File not found: ${databasePath}`);
      }
      let sequelize = new Sequelize({
        dialect: 'sqlite',
        logging: debug,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        storage: databasePath
      });
      resolve(sequelize);
    });
  });
}

function ensureDevelopmentDbExists() {
  return new Promise((resolve, reject) => {
    fs.exists(dbPath('development'), (itExists) => {
      if (!itExists) {
        let stream = fs
          .createReadStream(dbPath('master'))
          .pipe(fs.createWriteStream(dbPath('development')));
        stream.on('finish', function () {
          resolve();
        });
        stream.on('error', function () {
          reject();
        });
      } else {
        resolve();
      }
    });
  });
}

class Db {
  constructor() {
    this._models = null;
  }
  _connectToDatabase() {
    return openDb('development').then(conn => {
      return conn.authenticate()
        .then(() => conn)
        .catch((err) => {
          process.stderr.write(chalk.red(' - Problem authenticating to database\n', err));
          process.exit(1);
        });
    }).catch(err => {
      process.stderr.write(chalk.red(' - Problem connecting to database\n', err));
      process.exit(1);
    });
  }

  transaction(cb) {
    return this.db.transaction(cb);
  }

  start() {
    return ensureDevelopmentDbExists()
      .then(() => this._connectToDatabase())
      .then(db => {
        this.db = db;
        process.stdout.write(chalk.blue('📦  Updating database'));
        return this.db.sync({ force: true }).catch((e) => {
          process.stderr.write('Problem synchronizing database', e);
        });
      })
      .then(() => {
        process.stdout.write(chalk.blue('   Database update complete ✅'));
      });
  }

  get models() {
    if (this._models === null) {
      this._models = dbModels(this.db);
    }
    return this._models;
  }
}

module.exports = Db;