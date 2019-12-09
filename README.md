# Merged PR Tracker

Append a PR number of merged pull requests into PR description of the base branch.

## Example usage

uses: takuya-kikuchi/action-track-merged-pr@v1
with:
  SOURCE_BRANCH_NAME: ${{ github.event.pull_request.base.ref }}
  REPOSITORY_OWNER_NAME: ${{ github.event.pull_request.base.repo.owner.login }}
  REPOSITORY_NAME: ${{ github.event.pull_request.base.repo.name }}
  MERGED_PR_NUMBER: ${{ github.event.pull_request.number }}
  MERGED_PR_TITLE: ${{ github.event.pull_request.title }}
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
