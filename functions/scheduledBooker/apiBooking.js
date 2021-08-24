"use strict";

const axios = require("axios").default;
const { logger } = require("./logger.js");
const { DateTime } = require("luxon");
const config = require("./config.js").booking;
const constants = require("./constants.js");
const { wait } = require("./wait.js");
const { todayDateString, timetableDateString } = require("./date.js");
const Err = require("./error.js");

const headers = {
  Host: "nuffield.bookingbug.com",
  Connection: "close",
  Accept: "application/hal+json,application/json",
  "App-Id": "f6b16c23",
  "App-Key": "f0bc4f65f4fbfe7b4b3b7264b655f5eb",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
  "Content-Type": "application/json",
  Origin: "https://www.nuffieldhealth.com",
  "Sec-Fetch-Site": "cross-site",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  Referer: "https://www.nuffieldhealth.com/",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
};

module.exports = async function apiBooking(authToken, member_ID) {
  headers["Auth-Token"] = authToken;
  config.member_ID = member_ID;

  const results = {
    totalNumAvailClasses: null,
    booking: [],
    errorCounter: 0,
  };

  for (let attempt = 0; attempt <= config.numBookingChecks; attempt++) {
    try {
      logger(`---- API Booking attempt: ${attempt + 1} ----`);
      let availClasses = await getAvailClasses();
      let numAvailClasses = availClasses.length;
      processAvailClasses(numAvailClasses, results);

      if (numAvailClasses >= 1) {
        results.booking = results.booking.concat(
          await bookClasses(availClasses)
        );
        logger(
          `Booked classes: ${results.booking.length} / ${results.totalNumAvailClasses}`
        );
      }

      if (isBookingCompleted(attempt, numAvailClasses, results) === true) break;

      tryExpandingTimeSlot(attempt);

      await wait(1000);
    } catch (err) {
      results.errorCounter++;
      console.error(
        `---- API Booking error ${results.errorCounter}: ${err} ----`
      );
      if (results.errorCounter >= config.errorRetries) {
        // console.error("Too many errors! Exiting");
        throw new Err("BOOKING_ERROR", "Too many booking errors!");
        // break;
      }
    }
  }

  if (results.booking.length === 0)
    throw new Err(
      "NO_CLASSES_BOOKED",
      `No Classes were booked. Encountered ${results.errorCounter} errors`
    );

  return {
    numBookedClasses: results.booking.length,
    numErrors: results.errorCounter,
  };
};

function processAvailClasses(numAvailClasses, results) {
  if (results.totalNumAvailClasses === null && numAvailClasses >= 1) {
    results.totalNumAvailClasses = numAvailClasses;
    logger(`Total avail classes: ${results.totalNumAvailClasses}`);
  } else {
    logger(`Avail classes for attempt: ${numAvailClasses}`);
  }
}

function isBookingCompleted(attempt, numAvailClasses, results) {
  // check at least two times (attempt > 1) to see if we've booked all available classes
  if (
    results.totalNumAvailClasses >= 1 &&
    results.booking.length >= results.totalNumAvailClasses &&
    numAvailClasses == 0 &&
    attempt >= 1
  ) {
    logger(`---- Booked classes info ----`);
    logger(results.booking);
    return true;
  }
  return false;
}

function tryExpandingTimeSlot(attempt) {
  // if we fail to book anything try expanding the time slot
  if (
    attempt >= config.numBookingChecks / 2 - 1 &&
    config.timeFallback == true &&
    (config.timesToBook.AM == false || config.timesToBook.PM == false)
  ) {
    logger(`!!!! Expanding Time Slot !!!!`);
    config.timesToBook.AM = true;
    config.timesToBook.PM = true;
  }
}

const getBookedClassDatetimes = async () => {
  logger("Getting current list of Booked Classes...");
  const response = await axios({
    method: "get",
    url: `${constants.apiURL}/api/v1/${config.company_ID}/members/${config.member_ID}/bookings?start_date=${todayDateString}`,
    headers,
  });
  const bookedClasses = response.data._embedded.bookings.reduce(
    (classes, thisclass) => {
      return classes.concat(thisclass.datetime);
    },
    []
  );

  logger(`Current num booked classes: ${bookedClasses.length}`);
  return bookedClasses;
};

const getAvailClasses = async () => {
  // here we don't necessarily need to re-retrieve the timetable data...
  let bookedClasses = await getBookedClassDatetimes();
  logger(`Retrieving timetable for ${timetableDateString}...`);
  let response = await axios({
    method: "get",
    url: `${constants.apiURL}/api/v1/${config.gym_ID}/events?start_date=${timetableDateString}&end_date=${timetableDateString}&per_page=600&embed=person&include_non_bookable=true`,
    headers,
  });
  logger(`Retrieved ${response.data.total_entries} events`);

  return response.data._embedded.events.reduce((availClasses, event) => {
    if (
      classNameMatches(event.description) &&
      event.bookable &&
      timeSlotMatches(event.datetime) &&
      !classAlreadyBooked(event.datetime, bookedClasses)
    ) {
      availClasses = availClasses.concat({
        event_id: event.id,
        event_chain_id: event.event_chain_id,
        description: event.description,
        datetime: event.datetime,
        isBookable: event.bookable,
      });
    }
    return availClasses;
  }, []);
};

const classAlreadyBooked = (datetime, bookedClasses) => {
  return bookedClasses.includes(datetime);
};

const timeSlotMatches = (datetime) => {
  const hourIsBetween = (startHour, lowerLimit, upperLimit) => {
    return startHour >= lowerLimit && startHour < upperLimit;
  };

  let startHour = DateTime.fromISO(datetime)
    .setLocale("en-GB")
    .setZone("Europe/London").hour;

  if (config.timesToBook.AM && hourIsBetween(startHour, 6, 12)) return true;
  else if (config.timesToBook.PM && hourIsBetween(startHour, 12, 22))
    return true;
  else return false;
};

const classNameMatches = (className) => {
  return config.classesToBook.some((thisClass) =>
    className.includes(thisClass)
  );
};

const bookClasses = async (availClasses) => {
  let bookingResults = [];
  await availClasses.reduce(async (memo, thisclass) => {
    await memo;
    logger(`Adding ${thisclass.description} to basket...`);
    await axios({
      method: "post",
      url: `${constants.apiURL}/api/v1/${config.gym_ID}/basket/add_item`,
      headers,
      data: {
        entire_basket: true,
        items: [
          {
            event_id: thisclass.event_id,
            event_chain_id: thisclass.event_chain_id,
            member_id: config.member_ID,
          },
        ],
      },
    });

    logger(`Checking-out basket...`);
    let response = await axios({
      method: "post",
      url: `${constants.apiURL}/api/v1/${config.gym_ID}/basket/checkout`,
      headers,
      data: {
        client: {
          id: config.member_ID,
        },
      },
    });

    let bookedClass = response.data._embedded.bookings[0];

    bookingResults.push({
      // event_id: bookedClass.slot_id,
      className: bookedClass.full_describe,
      datetimeString: bookedClass.describe,
      datetime: bookedClass.datetime,
      bookingType: bookedClass.booking_type,
    });

    return Promise.resolve();
  }, Promise.resolve());

  return bookingResults;
};
