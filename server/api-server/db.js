const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const dbModels = require('./models');


const PROJECT_ROOT_PATH = path.join(__dirname, '..', '..');

function dbPath(name) {
  return path.join(PROJECT_ROOT_PATH, 'db', `${name}.sqlite`);
}

async function openDb(name) {
  let databasePath = dbPath(name);

  return new Promise((resolve, reject) => {
    fs.exists(databasePath, (itExists) => {
      if (!itExists) {
        reject(`File not found: ${databasePath}`);
      }
      let sequelize = new Sequelize({
        dialect: 'sqlite',
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

async function ensureDevelopmentDbExists() {
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
  async _connectToDatabase() {
    let conn
    try {
      conn = await openDb('development');
    } catch (err) {
      process.stderr.write(chalk.red(' - Problem connecting to database\n', err));
      process.exit(1);
    }
    return conn.authenticate()
      .then(() => conn)
      .catch((err) => {
        process.stderr.write(chalk.red(' - Problem authenticating to database\n', err));
        process.exit(1);
      });
  }
  async start() {
    await ensureDevelopmentDbExists();
    this.db = await this._connectToDatabase();
    this.models;
  }

  get models() {
    if (this._models === null) {
      this._models = dbModels(this.db);
    }
    return this._models;
  }
}

module.exports = Db;