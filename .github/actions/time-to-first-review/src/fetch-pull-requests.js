const github = require("@actions/github");

module.exports = async (repo, token, numPRs) => {
  const octokit = github.getOctokit(token);

  if (numPRs > 100) {
    numPRs = 100;
    console.log("Number of PRs requested is greater than 100");
  }

  try {
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      state: "closed",
      per_page: numPRs,
    });

    return pullRequests;
  } catch (error) {
    console.error("Error fetching pull requests:", error.message);
    return [];
  }
};
