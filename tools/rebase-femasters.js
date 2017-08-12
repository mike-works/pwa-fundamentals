var spawnSync = require('child_process').spawnSync;

function rebaseBranch(branchName, baseBranchName) {
  console.log(`rebasing ${branchName} onto ${baseBranchName}`);
  spawnSync(`git checkout ${branchName}`);
  spawnSync(`git rebase ${baseBranchName}`);
}

let branches = ['master', 'femasters/1-begin', 'femasters/1-complete'];

for (let i = 1; i < branches.length; i++) {
  rebaseBranch(branches[i], branches[i-1]);
}