const config = require("./config.js");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const { timeNowMillis, millisFromFormat } = require("./date.js");
const { logger } = require("./logger.js");
// const { bookingTicketChecker, ticketCleanup } = require("./ticket.js");
const { wait } = require("./wait.js");
const runWithConfig = {
  timeoutSeconds: 540,
  memory: "2GB",
};

module.exports.default = functions
  //   @ts-ignore
  .runWith(runWithConfig)
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    config.booking = await config.getConfig();
    const makeBooking = require("./makeBooking.js");
    const data = await makeBooking();
    res.json(data);
    return null;
  });

// const getConfig = async () => {
//   let bookingConfig = await db.collection("Config").doc("booking").get();
//   config.booking = bookingConfig.data();
// };

const checkRetryTimeout = () => {
  let startTime = millisFromFormat(config.booking.startTime);

  logger(`${(timeNowMillis() - startTime) / 1000} seconds since first run`);
  if (timeNowMillis() - startTime > config.booking.retryTimeout) {
    logger(
      `Retries have exceed the ${
        config.booking.retryTimeout / 1000 / 60
      } minute limit. Exiting...`
    );
    return true;
  } else return false;
};
