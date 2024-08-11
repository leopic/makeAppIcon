const axios = require("axios");
const moment = require("moment");
const core = require("@actions/core");
// const github = require("@actions/github");

try {
  // GitHub repository information
  const REPO = core.getInput("repo");
  const GITHUB_TOKEN = core.getInput("github_token");
  const NUM_PRS = core.getInput("num_prs") || 500;

  console.debug(`REPO: ${REPO}`);
  console.debug(`GITHUB_TOKEN: ${GITHUB_TOKEN}`);
  console.debug(`NUM_PRS: ${NUM_PRS}`);

  // Function to calculate the time difference in hours
  const calculateTimeDifference = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, "hours");
  };

  // Fetch the last NUM_PRS PRs
  const fetchPullRequests = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${REPO}/pulls?state=closed&per_page=${NUM_PRS}`,
        {
          headers: { Authorization: `token ${GITHUB_TOKEN}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pull requests:", error.message);
      return [];
    }
  };

  // Fetch reviews for a specific PR
  const fetchReviews = async (prNumber) => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${REPO}/pulls/${prNumber}/reviews`,
        {
          headers: { Authorization: `token ${GITHUB_TOKEN}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching reviews for PR #${prNumber}:`,
        error.message
      );
      return [];
    }
  };

  // Main function
  const main = async () => {
    const prs = await fetchPullRequests();
    let timesToFirstReview = [];

    for (const pr of prs) {
      const prCreatedAt = pr.created_at;
      const reviews = await fetchReviews(pr.number);

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
      console.log(`No reviews found for the last ${NUM_PRS} PRs.`);
    }
  };

  main();
} catch (error) {
  core.setFailed(error.message);
}
