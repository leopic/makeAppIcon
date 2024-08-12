const core = require("@actions/core");

const fetchPullRequests = require("./src/fetch-pull-requests");
const fetchReviews = require("./src/fetch-reviews");
const calculateTimeDifference = require("./src/calculate-time-difference");

const getTimeToFirstReview = async (pr, repo, gitHubToken) => {
  const prCreatedAt = pr.created_at;
  const reviews = await fetchReviews(repo, gitHubToken, pr.number);

  // Find the first review date
  const firstReviewDate = reviews
    .map((review) => review.submitted_at)
    .filter((date) => date) // filter out null or undefined
    .sort()[0]; // Get the earliest review date

  if (!firstReviewDate) {
    console.log(`PR #${pr.number} - No reviews found`);
    return undefined;
  }

  const timeToFirstReview = calculateTimeDifference(
    prCreatedAt,
    firstReviewDate
  );

  console.log(
    `PR #${pr.number} - Time to first review: ${timeToFirstReview} hours`
  );

  return timeToFirstReview;
};

try {
  // GitHub repository information
  const repo = core.getInput("repo");
  const token = core.getInput("github_token");
  const maxPRs = core.getInput("num_prs") || 200;

  // Main function
  const main = async () => {
    const prs = await fetchPullRequests(repo, token, maxPRs);

    let timesToFirstReview = await Promise.all(
      prs
        .map((pr) => getTimeToFirstReview(pr, repo, token))
        .filter((time) => time)
    );

    console.log("All times to first review:", timesToFirstReview);

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
