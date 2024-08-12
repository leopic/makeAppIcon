const core = require("@actions/core");

const fetchPullRequests = require("./src/fetch-pull-requests");
const getTimeToFirstReview = require("./src/get-time-to-first-review");

try {
  // GitHub repository information
  const repo = core.getInput("repo");
  const token = core.getInput("github_token");
  const maxPRs = core.getInput("num_prs") || 200;

  // Main function
  const main = async () => {
    const prs = await fetchPullRequests(repo, token, maxPRs);

    let timesToFirstReview = await Promise.all(
      prs.map((pr) => getTimeToFirstReview(pr, repo, token))
    );

    timesToFirstReview = timesToFirstReview.filter(
      (time) => time !== undefined
    );

    if (timesToFirstReview.length > 0) {
      const total = timesToFirstReview.reduce((sum, value) => sum + value, 0);
      const average = total / timesToFirstReview.length;
      console.log(`Average time to first review: ${average.toFixed(2)} hours`);
    } else {
      console.log(`No reviews found for the last ${maxPRs} PRs.`);
    }
  };

  main();
} catch (error) {
  core.setFailed(error.message);
}
