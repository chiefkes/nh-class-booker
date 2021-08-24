const config = require("./config.js");
const functions = require("firebase-functions");
const { timeNowMillis, millisFromFormat } = require("./date.js");
const { logger } = require("./logger.js");
const { checkTickets, deleteTicket } = require("./ticket.js");
const { wait } = require("./wait.js");
const runWithConfig = {
  timeoutSeconds: 540,
  memory: "1GB",
  failurePolicy: true,
};

module.exports.default = functions
  // @ts-ignore
  .runWith(runWithConfig)
  .region("europe-west2")
  .pubsub.schedule("50 6 * * *")
  .timeZone("Europe/London")
  .onRun(async (context) => {
    try {
      config.booking = await config.getConfig();
      if (checkRetryTimeout()) return null;

      const ticket = await checkTickets();

      if (ticket !== null) {
        const makeBooking = require("./makeBooking.js");
        const data = await makeBooking();
        logger(`Successfully processed the following ticket: ${ticket.id}`);
        deleteTicket(ticket);
      }

      return null;
    } catch (err) {
      const type = err.type || "UNDEFINED";
      switch (type) {
        case "GET_CONFIG":
        case "NO_CLASSES_BOOKED":
          console.error(`Function exiting with error: ${type}`);
          return null;
        case "UNDEFINED":
          console.error(`Unhandled Error Message: ${err}`);
        case "BOOKING_ERROR":
        case "AUTH_API":
          if (config.booking.retry) {
            await wait(15000);
            return Promise.reject(
              `Function exiting with error: ${type} - will retry.`
            );
          } else {
            logger(
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
