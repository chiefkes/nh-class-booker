"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const config = require("./config.js");
const { timeNowMillis, millisFromFormat } = require("./date.js");
const { logger } = require("./logger.js");
const { bookingTicketChecker, ticketCleanup } = require("./ticket.js");
const { wait } = require("./wait.js");
const runWithConfig = {
  timeoutSeconds: 540,
  memory: "2GB",
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
      await getConfig();
      if (checkRetryTimeout()) {
        return null;
      }
      let ticket = await bookingTicketChecker();
      if (ticket !== null) {
        let result = null;
        const { bookingHandler } = require("./bookingHandler.js");
        const handler = new bookingHandler();
        result = await handler.runBooking();
        if (result === "success") {
          logger(`Successfully processed the following ticket: ${ticket.id}`);
          ticketCleanup(ticket);
        }
      }
      return null;
    } catch (err) {
      switch (err.message) {
        case "01": // totalNumClassesBooked === 0
          console.error(
            `Function exiting with Error Code 01 - No Available/Booked classes`
          );
          return null;

        default:
          console.error(`Unhandled Error Message: ${err}`);
        case "02": // Too many bookingAttemptHandler Errors
          if (config.booking.retry) {
            await wait(15000);
            return Promise.reject(`Function exiting - will retry.`);
          } else {
            logger(`Retries are disabled. Exiting...`);
            return null;
          }
      }
    }
  });

const getConfig = async () => {
  let bookingConfig = await db.collection("Config").doc("booking").get();
  config.booking = bookingConfig.data();
  let browserConfig = await db.collection("Config").doc("browserHandler").get();
  config.browserHandler = browserConfig.data();
};

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
