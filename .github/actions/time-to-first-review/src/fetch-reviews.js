const axios = require("axios");

// Fetch reviews for a specific PR
export const fetchReviews = async (repo, token, prNumber) => {
  try {
    const response = await axios.get(
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
