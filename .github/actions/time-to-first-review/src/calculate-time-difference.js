const moment = require("moment");

export const calculateTimeDifference = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.diff(start, "hours");
};
