const getTimeToFirstReview = require("./get-time-to-first-review");
const fetchPullRequests = require("./fetch-pull-requests");

module.exports = async (repo, token, maxPRs) => {
  const prs = await fetchPullRequests(repo, token, maxPRs);

  let timesToFirstReview = await Promise.all(
    prs.map((pr) => getTimeToFirstReview(pr, repo, token))
  );

  timesToFirstReview = timesToFirstReview.filter((time) => time !== undefined);

  if (timesToFirstReview.length > 0) {
    const total = timesToFirstReview.reduce((sum, value) => sum + value, 0);
    const average = total / timesToFirstReview.length;
    console.log(`Average time to first review: ${average.toFixed(2)} hours`);
  } else {
    console.log(`No reviews found for the last ${maxPRs} PRs.`);
  }
};
