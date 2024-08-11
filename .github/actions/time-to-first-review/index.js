const core = require("@actions/core");

const fetchPullRequests = require("./src/fetch-pull-requests").default;
const fetchReviews = require("./src/fetch-reviews").default;
const calculateTimeDifference =
  require("./src/calculate-time-difference").default;

try {
  // GitHub repository information
  const repo = core.getInput("repo");
  const gitHubToken = core.getInput("github_token");
  const maxPRs = core.getInput("num_prs") || 500;

  // Main function
  const main = async () => {
    const prs = await fetchPullRequests(repo, gitHubToken, maxPRs);
    let timesToFirstReview = [];

    for (const pr of prs) {
      const prCreatedAt = pr.created_at;
      const reviews = await fetchReviews(repo, gitHubToken, pr.number);

      // Find the first review date
      const firstReviewDate = reviews
        .map((review) => review.submitted_at)
        .filter((date) => date) // filter out null or undefined
        .sort()[0]; // Get the earliest review date

      if (!firstReviewDate) {
        console.log(`PR #${pr.number} - No reviews found`);
        continue;
      }

      const timeToFirstReview = calculateTimeDifference(
        prCreatedAt,
        firstReviewDate
      );

      timesToFirstReview.push(timeToFirstReview);

      console.log(
        `PR #${pr.number} - Time to first review: ${timeToFirstReview} hours`
      );
    }

    // Calculate average and median
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
