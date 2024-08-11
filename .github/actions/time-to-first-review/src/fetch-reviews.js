import { get } from "axios";

// Fetch reviews for a specific PR
module.exports = async (repo, token, prNumber) => {
  try {
    const response = await get(
      `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for PR #${prNumber}:`, error.message);
    return [];
  }
};
