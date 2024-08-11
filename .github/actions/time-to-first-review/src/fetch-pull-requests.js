import { get } from "axios";

module.exports = async (repo, token, numPRs) => {
  try {
    const response = await get(
      `https://api.github.com/repos/${repo}/pulls?state=closed&per_page=${numPRs}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pull requests:", error.message);
    return [];
  }
};
