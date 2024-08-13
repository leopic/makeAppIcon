jest.mock("../get-time-to-first-review");
jest.mock("../fetch-pull-requests");

const getTimeToFirstReview = require("../get-time-to-first-review");
const fetchPullRequests = require("../fetch-pull-requests");

const main = require("..");

describe("main", () => {
  const repo = "owner/repo";
  const token = "token";
  const maxPRs = 10;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should call getTimeToFirstReview and fetchPullRequests with the correct arguments", async () => {
    fetchPullRequests.mockResolvedValue([
      {
        id: 1,
      },
      {
        id: 2,
      },
    ]);

    getTimeToFirstReview.mockResolvedValue(5);

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await main(repo, token, maxPRs);

    expect(fetchPullRequests).toHaveBeenCalledWith(repo, token, maxPRs);
    expect(getTimeToFirstReview).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Average time to first review: 5.00 hours"
    );
  });
});
