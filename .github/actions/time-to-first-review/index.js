const core = require("@actions/core");

const main = require("./src");

try {
  const repo = core.getInput("repo");
  const token = core.getInput("github_token");
  const maxPRs = core.getInput("num_prs") || 100;
  main(repo, token, maxPRs);
} catch (error) {
  core.setFailed(error.message);
}
