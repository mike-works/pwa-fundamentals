// @ts-check
/* eslint-env node */
const { spawn } = require('child_process');

function checkoutBranch(branchName) {
  return new Promise((resolve, reject) => {
    let gco = spawn('git', ['checkout', branchName]);
    gco.stdout.pipe(process.stdout);
    gco.on('close', () => {
      resolve();
    });
  });
}

function rebaseOnto(baseBranchName) {
  return new Promise((resolve, reject) => {
    let gco = spawn('git', ['rebase', baseBranchName]);
    gco.stdout.pipe(process.stdout);
    gco.on('close', () => {
      resolve();
    });
  });
}


function rebaseBranch(branchName, baseBranchName) {
  console.log(`rebasing ${branchName} onto ${baseBranchName}`);
  return checkoutBranch(branchName)
    .then(() => rebaseOnto(baseBranchName));
}

let branches = [
  'master',
  'femasters/1-begin', 'femasters/1-complete',
  'femasters/2-begin', 'femasters/2-complete',
  'femasters/3-begin', 'femasters/3-complete',
  'femasters/4-begin', 'femasters/4-complete',
  'femasters/5-begin', 'femasters/5-complete',
  'femasters/6-begin', 'femasters/6-complete',
  'femasters/7-begin', 'femasters/7-complete',
  'femasters/8-begin', 'femasters/8-complete',
  'femasters/9-begin', 'femasters/9-complete', 'femasters/9-enhanced',
  'femasters/10-begin', 'femasters/10-complete',
  'femasters/11-begin', 'femasters/11-complete',
  'femasters/12-begin', 'femasters/12-complete',
  'femasters/13-begin', 'femasters/13-complete',
  'femasters/final'
];
let p = Promise.resolve();
for (let i = 1; i < branches.length; i++) {
  p.then(() => rebaseBranch(branches[i], branches[i-1]));
}