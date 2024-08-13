// Mock the fetchReviews function
jest.mock("../fetch-reviews", () => jest.fn());

const getTimeToFirstReview = require("../get-time-to-first-review");
const fetchReviews = require("../fetch-reviews");

const repo = "owner/repo";
const gitHubToken = "my-token";

describe.only("getTimeToFirstReview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should return the time difference between the PR creation and the first review", async () => {
    const pr = { number: 1, created_at: new Date("2024-01-01T00:00:00Z") };

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    fetchReviews.mockResolvedValue([
      { submitted_at: new Date("2024-01-01T01:00:00Z") },
      { submitted_at: new Date("2024-01-01T02:00:00Z") },
    ]);

    const result = await getTimeToFirstReview(pr, repo, gitHubToken);

    expect(result).toBe(1);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "PR #1 - Time to first review: 1 hours"
    );
  });

  it("should return 0 if there are no reviews", async () => {
    const pr = { number: 1, created_at: new Date("2024-01-01T00:00:00Z") };

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    fetchReviews.mockResolvedValue([]);

    const result = await getTimeToFirstReview(pr, repo, gitHubToken);

    expect(result).toBe(undefined);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith("PR #1 - No reviews found");
  });

  it("should return 0 if the first review is created before the PR", async () => {
    const pr = { number: 1, created_at: new Date("2024-01-01T00:00:00Z") };

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    fetchReviews.mockResolvedValue([
      { submitted_at: new Date("2023-12-31T23:00:00Z") },
      { submitted_at: new Date("2024-01-01T01:00:00Z") },
    ]);

    const result = await getTimeToFirstReview(pr, repo, gitHubToken);

    expect(result).toBe(0);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "PR #1 - Time to first review: 0 hours"
    );
  });
});
