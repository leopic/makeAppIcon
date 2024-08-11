const axios = require("axios");
const moment = require("moment");

// GitHub repository information
const REPO = process.env.REPO;

// GitHub Personal Access Token (PAT) for authentication
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Number of PRs to fetch
const NUM_PRS = process.env.NUM_PRS || 500;

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
    console.error(`Error fetching reviews for PR #${prNumber}:`, error.message);
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

    if (firstReviewDate) {
      const timeToFirstReview = calculateTimeDifference(
        prCreatedAt,
        firstReviewDate
      );
      timesToFirstReview.push(timeToFirstReview);
      console.log(
        `PR #${pr.number} - Time to first review: ${timeToFirstReview} hours`
      );
    } else {
      console.log(`PR #${pr.number} - No reviews found`);
    }
  }

  // Calculate average and median
  if (timesToFirstReview.length > 0) {
    const total = timesToFirstReview.reduce((sum, value) => sum + value, 0);
    const average = total / timesToFirstReview.length;

    const sortedTimes = timesToFirstReview.slice().sort((a, b) => a - b);
    const middle = Math.floor(sortedTimes.length / 2);
    const median =
      sortedTimes.length % 2 === 0
        ? (sortedTimes[middle - 1] + sortedTimes[middle]) / 2
        : sortedTimes[middle];

    console.log(`Average time to first review: ${average.toFixed(2)} hours`);
    console.log(`Median time to first review: ${median.toFixed(2)} hours`);
  } else {
    console.log(`No reviews found for the last ${NUM_PRS} PRs.`);
  }
};

main();
