const mockListReviews = jest.fn().mockReturnValue({
  data: [
    {
      id: 1,
      submitted_at: "2021-09-01T00:00:00Z",
    },
    {
      id: 2,
      submitted_at: "2021-09-02T00:00:00Z",
    },
  ],
});

jest.mock("@actions/github", () => ({
  getOctokit: jest.fn().mockReturnValue({
    rest: {
      pulls: {
        listReviews: mockListReviews,
      },
    },
  }),
}));

const fetchReviews = require("../fetch-reviews");

describe("fetchReviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should log an error to the console when the request fails", async () => {
    const mockError = new Error("Request failed");
    mockListReviews.mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const reviews = await fetchReviews("owner/repo", "token", 3);

    expect(reviews.length).toBe(0);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching reviews for PR #3:",
      "Request failed"
    );
  });
  it("should parse and create the request for reviews of a single PR", async () => {
    const reviews = await fetchReviews("owner/repo", "token", 3);

    expect(reviews.length).toBe(2);
    expect(mockListReviews).toHaveBeenCalledTimes(1);
    expect(mockListReviews).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      pull_number: 3,
    });
  });
});
