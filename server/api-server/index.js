const chalk = require('chalk');
const Db = require('./db');

class ApiServer {
  constructor(prog) {
    this.program = prog;
    this.db = new Db();
  }
  
  async start() {
    await this.db.start();

    process.stdout.write(
      chalk.white(` - Starting API on http://localhost:${this.program.apiPort}\n\n`)
    );
  }
}

module.exports = ApiServer;