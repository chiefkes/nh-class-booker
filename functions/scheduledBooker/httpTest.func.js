const config = require("./config.js");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { timeNowMillis, millisFromFormat } = require("./date.js");
const { logger } = require("./logger.js");
const { checkTickets, deleteTicket } = require("./ticket.js");
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
    try {
      config.booking = await config.getConfig();

      if (checkRetryTimeout()) {
        res.json("function timed out");
        return null;
      }

      const ticket = await checkTickets();
      if (ticket !== null) {
        const makeBooking = require("./makeBooking.js");
        const data = await makeBooking();
        res.json(data);
      } else {
        res.json("No Ticket");
      }
      return null;
    } catch (err) {
      const type = err.type || "UNDEFINED";
      switch (type) {
        case "GET_CONFIG":
        case "NO_CLASSES_BOOKED":
          console.error(`Function exiting with error: ${type}`);
          res.json(`Function exiting with error: ${type}`);
          return null;

        case "UNDEFINED":
          console.error(`Unhandled Error Message: ${err}`);
        case "BOOKING_ERROR":
        case "AUTH_API":
          if (config.booking.retry) {
            // await wait(15000);
            console.error(`Function exiting with error: ${type} - will retry.`);
            res.json(`Function exiting with error: ${type} - will retry.`);
            return null;
          } else {
            logger(
              `Retries are disabled. Function exiting with error: ${type}...`
            );
            res.json(
              `Retries are disabled. Function exiting with error: ${type}...`
            );
            return null;
          }
      }
    }
  });

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
