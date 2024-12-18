const moment = require("moment");

module.exports = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.diff(start, "hours");
};
