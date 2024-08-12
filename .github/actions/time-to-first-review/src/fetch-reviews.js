const axios = require("axios");
const github = require("@actions/github");

// Fetch reviews for a specific PR
module.exports = async (repo, token, prNumber) => {
  try {
    const octokit = github.getOctokit(token);

    const out = octokit.rest.pulls.listReviews({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      pull_number: prNumber,
    });

    console.log(out);
    console.log(" - - - ");

    const response = await axios.get(
      `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for PR #${prNumber}:`, error.message);
    return [];
  }
};
