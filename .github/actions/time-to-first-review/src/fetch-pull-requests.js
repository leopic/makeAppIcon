const axios = require("axios");
const github = require("@actions/github");

module.exports = async (repo, token, numPRs) => {
  const octokit = github.getOctokit(token);

  try {
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      state: "closed",
      per_page: numPRs,
    });

    return pullRequests;
    // const response = await axios.get(
    //   `https://api.github.com/repos/${repo}/pulls?state=closed&per_page=${numPRs}`,
    //   {
    //     headers: { Authorization: `token ${token}` },
    //   }
    // );
    // return response.data;
  } catch (error) {
    console.error("Error fetching pull requests:", error.message);
    return [];
  }
};
