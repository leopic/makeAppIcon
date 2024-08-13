const calculateTimeDifference = require("../calculate-time-difference");

describe("calculateTimeDifference", () => {
  it("should calculate time difference between two dates", () => {
    const startDate = new Date("2022-01-01T00:00:00Z");
    const endDate = new Date("2022-01-01T12:00:00Z");

    const difference = calculateTimeDifference(startDate, endDate);

    expect(difference).toBe(12);
  });

  it("should calculate time difference when start date is after end date", () => {
    const startDate = new Date("2022-01-02T00:00:00Z");
    const endDate = new Date("2022-01-01T12:00:00Z");

    const difference = calculateTimeDifference(startDate, endDate);

    expect(difference).toBe(-12);
  });

  it("should calculate time difference when start date and end date are the same", () => {
    const startDate = new Date("2022-01-01T00:00:00Z");
    const endDate = new Date("2022-01-01T00:00:00Z");

    const difference = calculateTimeDifference(startDate, endDate);

    expect(difference).toBe(0);
  });
});
