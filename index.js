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

  const owner = core.getInput('REPOSITORY_OWNER_NAME');
  const repo = core.getInput('REPOSITORY_NAME');
  const apiKey = core.getInput('GITHUB_TOKEN');
  const mergedPRNumber = core.getInput('MERGED_PR_NUMBER');

  core.debug(`owner: ${owner}`);
  core.debug(`repo: ${repo}`);
  core.debug(`mergedPRNumber: ${mergedPRNumber}`);

  const octokit = new Octokit({ auth: apiKey });

  // Get information of a merged PR
  const mergedPR = await octokit.pulls.get({
    owner: owner,
    repo: repo,
    pull_number: mergedPRNumber
  });

  if(mergedPR == null) {
    core.debug(`A PR #${mergedPRNumber} does not exist`);
    return
  }
  if(!mergedPR.data.merged) {
    core.debug(`A PR #${mergedPRNumber} is not merged. Skipping.`);
  }

  core.debug(`merged PR: ${mergedPR.data.base.label}`);
  const sourceBranchLabel = mergedPR.data.base.label
  const mergedPRTitle = mergedPR.data.title

  // Get an existing PR of a base branch of the merged PR
  const pulls = await octokit.pulls.list({
    owner: owner,
    repo: repo,
    head: sourceBranchLabel
  });
  const pr = pulls.data.shift();

  // Do nothing when got an invalid PR
  if (pr.head.label != sourceBranchLabel) {
    return
  }

  core.debug(`Got pull request: ${pr.number}`)
  const currentBody = pr.body;

  // Update PR description of the branch
  await octokit.pulls.update({
    owner: owner,
    repo: repo,
    pull_number: pr.number,
    body: currentBody + '\n' + `Merged: PR #${mergedPRNumber}` + ` (${mergedPRTitle})`,
  });
}



