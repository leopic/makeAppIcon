const mockPullRequests = jest.fn().mockReturnValue({
  data: [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ],
});

jest.mock("@actions/github", () => ({
  getOctokit: jest.fn().mockReturnValue({
    rest: {
      pulls: {
        list: mockPullRequests,
      },
    },
  }),
}));

const fetchPullRequests = require("../fetch-pull-requests");

describe("fetchPullRequests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should fetch the specified number of pull requests", async () => {
    const repo = "owner/repo";
    const token = "your-github-token";
    const numPRs = 5;

    await fetchPullRequests(repo, token, numPRs);

    expect(mockPullRequests).toHaveBeenCalledTimes(1);
    expect(mockPullRequests).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      state: "closed",
      per_page: numPRs,
    });
  });

  it("should limit the number of pull requests to 100", async () => {
    const repo = "owner/repo";
    const token = "your-github-token";
    const numPRs = 150;

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await fetchPullRequests(repo, token, numPRs);

    expect(mockPullRequests).toHaveBeenCalledTimes(1);
    expect(mockPullRequests).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      state: "closed",
      per_page: 100,
    });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Number of PRs requested is greater than 100"
    );
  });

  it("should relay all PRs returned from the API", async () => {
    const repo = "owner/repo";
    const token = "your-github-token";
    const numPRs = 10;

    const pullRequests = await fetchPullRequests(repo, token, numPRs);

    expect(pullRequests.length).toBe(2);
  });

  it("should handle errors and log them to console.error", async () => {
    const repo = "owner/repo";
    const token = "your-github-token";
    const numPRs = 5;

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    mockPullRequests.mockRejectedValueOnce(
      new Error("Failed to fetch pull requests")
    );

    await fetchPullRequests(repo, token, numPRs);

    expect(mockPullRequests).toHaveBeenCalledTimes(1);
    expect(mockPullRequests).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      state: "closed",
      per_page: numPRs,
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching pull requests:",
      "Failed to fetch pull requests"
    );
  });
});
