const config = require("./config.js").booking;
const authorizeAPI = require("./authorizeAPI.js");
const apiBooking = require("./apiBooking.js");

async function makeBooking() {
  const { authToken, member_ID } = await authorizeAPI();

  const { numBookedClasses, numErrors } = await apiBooking(
    authToken,
    member_ID
  );

  console.log(`Total number of classes booked = ${numBookedClasses}`);

  return {
    numBookedClasses,
    numErrors,
    authToken,
    member_ID,
  };
}

module.exports = makeBooking;
