const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const PROJECT_ROOT_PATH = path.join(__dirname, '..', '..', '..');

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

class Db {
  async ensureDevelopmentDbExists() {
    return new Promise((resolve) => {
      fs.exists(dbPath('development'), (itExists) => {
        if (!itExists) {
          fs.createReadStream(dbPath('master'))
            .pipe(fs.createWriteStream(dbPath('development')));
          resolve();
        }
      });
    });
  }

  async _connectToDatabase() {
    let conn
    try {
      conn = await openDb('development');
    } catch (err) {
      process.stderr.write(chalk.red(err));
      process.exit(0);
    }

    return conn.authenticate().catch((err) => {
      process.stderr.write(chalk.red(' - Problem connecting to database\n', err));
      process.exit(0);
    });
  }
  async start() {
    await this.ensureDevelopmentDbExists();
    await this._connectToDatabase();
  }
}

module.exports = Db;