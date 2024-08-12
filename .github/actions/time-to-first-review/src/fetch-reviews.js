// const axios = require("axios");
const github = require("@actions/github");

// Fetch reviews for a specific PR
module.exports = async (repo, token, prNumber) => {
  try {
    const octokit = github.getOctokit(token);

    // const { pullRequest } = await octokit.rest.pulls.get({
    //   owner: repo.split("/")[0],
    //   repo: repo.split("/")[1],
    //   pull_number: prNumber,
    // });

    // console.log(pullRequest);

    // Fetch pull request reviews
    const { data: reviews } = await octokit.rest.pulls.listReviews({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      pull_number: prNumber,
    });

    // console.log(reviews);

    return reviews;

    // return {
    //   pullRequest
    // };
  } catch (error) {
    console.error(`Error fetching reviews for PR #${prNumber}:`, error.message);
    return [];
  }
};
