const fetchReviews = require("./fetch-reviews");
const calculateTimeDifference = require("./calculate-time-difference");

module.exports = async (pr, repo, gitHubToken) => {
  const prCreatedAt = pr.created_at;
  const reviews = await fetchReviews(repo, gitHubToken, pr.number);

  // Find the first review date
  const firstReviewDate = reviews
    .map((review) => review.submitted_at)
    .filter((date) => date)
    .sort()[0];

  if (!firstReviewDate) {
    console.log(`PR #${pr.number} - No reviews found`);
    return undefined;
  }

  let timeToFirstReview = calculateTimeDifference(prCreatedAt, firstReviewDate);

  timeToFirstReview = Math.max(timeToFirstReview, 0);

  console.log(
    `PR #${pr.number} - Time to first review: ${timeToFirstReview} hours`
  );

  return timeToFirstReview;
};
