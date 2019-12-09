const core = require('@actions/core');
const Octokit = require("@octokit/rest");

core.debug("Starting...");

(async () => {
  try {
    await main();
  } catch (e) {
    core.setFailed(e.message);
  }
})();

async function main() {

  const sourceBranchName = core.getInput('SOURCE_BRANCH_NAME');
  const owner = core.getInput('REPOSITORY_OWNER_NAME');
  const repo = core.getInput('REPOSITORY_NAME');
  const apiKey = core.getInput('GITHUB_TOKEN');
  const mergedPRNumber = core.getInput('MERGED_PR_NUMBER');
  const mergedPRTitle = core.getInput('MERGED_PR_TITLE');

  core.debug(`sourceBranchName: ${sourceBranchName}`);
  core.debug(`owner: ${owner}`);
  core.debug(`repo: ${repo}`);
  core.debug(`mergedPRNumber: ${mergedPRNumber}`);
  core.debug(`mergedPRTitle: ${mergedPRTitle}`);

  const octokit = new Octokit({ auth: apiKey });
  const pulls = await octokit.pulls.list({
    owner: owner,
    repo: repo,
    head: `${owner}:${sourceBranchName}`
  });
  const pr = pulls.data.shift();

  // Do nothing when got an invalid PR
  if (pr.head.ref != sourceBranchName) {
    return
  }

  core.debug(`Got pull request: ${pr.number}`)
  const currentBody = pr.body;

  await octokit.pulls.update({
    owner: owner,
    repo: repo,
    pull_number: pr.number,
    body: currentBody + '\n' + `Merged: PR #${mergedPRNumber}` + ` (${mergedPRTitle})`,
  });
}



