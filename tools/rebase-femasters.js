// @ts-check
/* eslint-env node */
const { exec } = require('child_process');

function checkoutBranch(branchName) {
  console.log('schedule CHECKOUT ', branchName);
  return new Promise((resolve, reject) => {
    console.log('begin CHECKOUT ', branchName);
    let gco = exec(`git checkout ${branchName}`, (err, stdout, stderr) => {
      console.log('complete CHECKOUT ', branchName);
      resolve();
    });
  })
}

function rebaseOnto(baseBranchName) {
  console.log('schedule REBASE ', baseBranchName);
  return new Promise((resolve, reject) => {
    console.log('begin REBASE ', baseBranchName);
    exec(`git rebase ${baseBranchName}`, (err, stdout, stderr) => {
      console.log('complete REBASE ', baseBranchName);
      resolve();
    });
  });
}

function forcePush() {
  console.log('schedule FORCEPUSH ');
  return new Promise((resolve, reject) => {
    console.log('begin FORCEPUSH ');
    exec(`git push --force`, (err, stdout, stderr) => {
      console.log('complete FORCEPUSH');
      resolve();
    });
  });
}

function rebaseBranch(branchName, baseBranchName) {
  return checkoutBranch(branchName)
    .then(() => rebaseOnto(baseBranchName))
    .then(() => forcePush());
}

let branches = [
  'femasters/begin',
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
  p = p.then(() => rebaseBranch(branches[i], branches[i-1]));
}