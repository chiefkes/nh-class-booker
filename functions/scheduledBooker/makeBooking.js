const config = require("./config.js").booking;
const authorizeAPI = require("./authorizeAPI.js");

async function makeBooking() {
  let { authToken, member_ID } = await authorizeAPI();

  return {
    authToken,
    member_ID,
  };
}

module.exports = makeBooking;
