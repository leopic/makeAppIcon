const fetchReviews = require("./fetch-reviews");
const calculateTimeDifference = require("./calculate-time-difference");

module.exports = async (pr, repo, gitHubToken) => {
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
