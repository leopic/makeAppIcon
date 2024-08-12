const axios = require("axios");
const github = require("@actions/github");

// Fetch reviews for a specific PR
module.exports = async (repo, token, prNumber) => {
  try {
    const octokit = github.getOctokit(token);

    const { data: reviews } = await octokit.pulls.listReviews({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      pull_number: prNumber,
    });

    // const response = await axios.get(
    //   `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews`,
    //   {
    //     headers: { Authorization: `token ${token}` },
    //   }
    // );
    // return response.data;

    return reviews;
  } catch (error) {
    console.error(`Error fetching reviews for PR #${prNumber}:`, error.message);
    return [];
  }
};
