"use strict";

const axios = require("axios").default;
const { logger } = require("./logger.js");
const { DateTime } = require("luxon");
const config = require("./config.js").booking;
const constants = require("./constants.js");
const { wait } = require("./wait.js");
const { todayDateString, timetableDateString } = require("./date.js");

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

exports.directAPIBooking = async (SSOToken) => {
  const results = {
    totalNumAvailClasses: null,
    booking: [],
    errorCounter: 0,
  };

  if (
    SSOToken == null ||
    SSOToken.length != 236 ||
    !(await getAuthToken(SSOToken))
  )
    return [0, 1];

  for (let attempt = 0; attempt <= config.numBookingChecks; attempt++) {
    try {
      logger(`---- directAPIBooking attempt: ${attempt + 1} ----`);
      let availClasses = await getAvailClasses();

      if (results.totalNumAvailClasses === null && availClasses.length >= 1) {
        results.totalNumAvailClasses = availClasses.length;
        logger(`Total avail classes: ${results.totalNumAvailClasses}`);
      } else {
        logger(`Avail classes for attempt: ${availClasses.length}`);
      }

      if (availClasses.length >= 1) {
        results.booking = results.booking.concat(
          await bookClasses(availClasses)
        );
        logger(
          `Booked classes: ${results.booking.length} / ${results.totalNumAvailClasses}`
        );
      }

      // check at least three times (attempt > 1) to see if we've booked all available classes
      if (
        results.totalNumAvailClasses >= 1 &&
        results.booking.length >= results.totalNumAvailClasses &&
        availClasses.length == 0 &&
        attempt >= 2
      ) {
        logger(`---- Booked classes info ----`);
        logger(results.booking);
        break;
      }

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

      await wait(1000);
    } catch (err) {
      results.errorCounter++;
      console.error(
        `---- directAPIBooking error ${results.errorCounter}: ${err} ----`
      );
      if (results.errorCounter >= config.errorRetries) {
        console.error("Too many errors! Exiting");
        break;
      }
    }
  }
  return [results.booking.length, results.errorCounter];
};

const getAuthToken = async (SSOToken) => {
  let authStatus = false;
  let authError = 0;
  logger("Getting api AuthToken...");
  while (authStatus == false) {
    try {
      let response = await axios({
        method: "post",
        url: `${constants.apiURL}/api/v1/login/sso/${config.company_ID}`,
        headers: headers,
        data: {
          token: SSOToken,
        },
      });

      if (response.data.auth_token.length != 22)
        throw new Error(
          `Auth-Token length ${response.data.auth_token.length} is incorrect`
        );

      headers["Auth-Token"] = response.data.auth_token;
      config.member_ID = response.data._embedded.members[0].id;
      authStatus = true;
    } catch (err) {
      authError++;
      console.error(`Error getting Auth-Token: ${err}`);
      if (authError > 5) {
        return false;
      }
      await wait(2 ** authError * 300);
    }
  }
  return true;
};

const getBookedClassDatetimes = async () => {
  logger("Getting current list of Booked Classes...");
  let bookedClasses = [];
  let response = await axios({
    method: "get",
    url: `${constants.apiURL}/api/v1/${config.company_ID}/members/${config.member_ID}/bookings?start_date=${todayDateString}`,
    headers: headers,
  });
  response.data._embedded.bookings.forEach((thisclass) => {
    bookedClasses.push(thisclass.datetime);
  });
  logger(`Current num booked classes: ${bookedClasses.length}`);
  return bookedClasses;
};

const getAvailClasses = async () => {
  // here we don't necessarily need to re-retrieve the timetable data...
  let availClasses = [];
  let bookedClasses = await getBookedClassDatetimes();
  logger(`Retrieving timetable for ${timetableDateString}...`);
  let response = await axios({
    method: "get",
    url: `${constants.apiURL}/api/v1/${config.gym_ID}/events?start_date=${timetableDateString}&end_date=${timetableDateString}&per_page=600&embed=person&include_non_bookable=true`,
    headers: headers,
  });
  logger(`Retrieved ${response.data.total_entries} events`);

  // could use reduce here instead...
  response.data._embedded.events.forEach((event) => {
    if (
      classNameMatches(event.description) &&
      event.bookable &&
      timeSlotMatches(event.datetime) &&
      !classAlreadyBooked(event.datetime, bookedClasses)
    ) {
      availClasses.push({
        event_id: event.id,
        event_chain_id: event.event_chain_id,
        description: event.description,
        datetime: event.datetime,
        isBookable: event.bookable,
      });
    }
  });
  return availClasses;
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
      headers: headers,
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
      headers: headers,
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
  }, Promise.resolve());

  return bookingResults;
};
