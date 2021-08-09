"use strict";

const constants = require("./constants.js");
const { logger } = require("./logger.js");
const { asyncEach, asyncEachSeries } = require("./asyncTaskHandlers.js");
const puppetry = require("./puppetry.js");
const config = require("./config.js").booking;
const tasks = require("./asyncTaskLists.js");

exports.login = async (page) => {
  logger(`---- Logging In ----`);
  await asyncEachSeries(page, tasks.loginTasks.slice(0, 4));
  await asyncEach(page, tasks.loginTasks.slice(4, 9));
  await asyncEach(page, tasks.loginTasks.slice(9, 11));
  await asyncEachSeries(page, tasks.loginTasks.slice(11));

  if (
    (await puppetry.getPropertyValue(
      page,
      constants.pageHeader,
      "innerText"
    )) !==
    "Hello " + config.userName
  ) {
    throw new Error("not logged in");
  }
  logger("Successfully logged in");
};

exports.loadTimetable = async (page) => {
  logger(`---- Loading Timetable ----`);
  await asyncEachSeries(page, tasks.timetableTasks);

  if (
    (
      await puppetry.getPropertyValue(page, constants.tableHeader, "innerText")
    ).includes("LOG")
  ) {
    throw new Error("Error on timetable page - not logged-in");
  }
};

exports.selectLastDate = async (page) => {
  await asyncEachSeries(page, tasks.lastDateSelect);

  let lastDateClassName = await page.$eval(
    constants.lastDate,
    (el) => el.className
  );
  if (lastDateClassName.includes("is-active") !== true) {
    throw new Error("failed to click last date");
  }
  logger("Latest Day of Timetable loaded successfully");
  await puppetry.scrollToSelector(page, "#bb");
  await puppetry.generateScreenShot(page, "timetableloaded");
};

exports.classBooking = async (page) => {
  logger(`---- Booking Classes ----`);
  const rowCount = await getNumRows(page);
  let numClassesBooked = 0;

  for (let row = 0; row < rowCount; row++) {
    let classTime;
    let rowSel = `${constants.tblRows}:nth-child(${2 * row + 1})`;
    let prevRowSel = `${constants.tblRows}:nth-child(${2 * (row - 1) + 1})`;
    try {
      if (
        (await classNameMatches(page, rowSel)) &&
        (classTime = await timeSlotMatches(page, rowSel)) !== false &&
        (await classIsAvailable(page, rowSel))
      ) {
        if (config.book) {
          try {
            await bookClass(page, rowSel, prevRowSel);
            numClassesBooked++;
            await bookingConfirmation(page, classTime);
          } catch (err) {
            logger(`classBooking Error -> ${err}`);
            continue;
          }
        } else {
          await simulateBookingClass(page, rowSel, prevRowSel);
          logger("class booking simulated");
        }
      }
    } catch (err) {
      continue;
    }
  }
  return numClassesBooked;
};

const bookClass = async (page, rowSel, prevRowSel) => {
  await puppetry.scrollToSelector(page, prevRowSel + constants.className);
  await puppetry.generateScreenShot(page, "classBooking - Before");
  await page.$eval(rowSel + constants.bookButton, (el) => el.click());
  await page.waitForTimeout(1000);
  await puppetry.waitForTableLoading(page, config.timeout);
  await page.waitForTimeout(1000);
  await puppetry.generateScreenShot(page, "classBooking - After");
};

const bookingConfirmation = async (page, classTime) => {
  let bookingConfirmation = await puppetry.getPropertyValue(
    page,
    constants.bbBooked,
    "innerText"
  );
  logger(bookingConfirmation + ` (at ${classTime})`);
};

const simulateBookingClass = async (page, rowSel, prevRowSel) => {
  await puppetry.scrollToSelector(page, prevRowSel + constants.className);
  await puppetry.generateScreenShot(page, "classBooking");
  await puppetry.colourSelector(page, rowSel + constants.bookButton);
  await page.waitForTimeout(1000);
};

const getNumRows = async (page) => {
  const rowCount =
    (await page.$$eval(constants.tblRows, (array) => array.length)) / 2;
  if (rowCount === 0) throw new Error("no rows found");
  return rowCount;
};

const timeSlotMatches = async (page, rowSel) => {
  const hourIsBetween = (startHour, lowerLimit, upperLimit) => {
    return startHour >= lowerLimit && startHour < upperLimit;
  };

  let rowTimeSelector = rowSel + constants.classStartTime;
  await page.waitForSelector(rowTimeSelector, { visible: true });
  let classTime = await page.$eval(rowTimeSelector, (el) => el.innerText);
  let startHour = classTime.substr(0, 2);

  if (config.timesToBook.AM && hourIsBetween(startHour, 6, 12))
    return classTime;
  else if (config.timesToBook.PM && hourIsBetween(startHour, 12, 22))
    return classTime;
  else return false;
};

const classNameMatches = async (page, rowSel) => {
  let className = await page.$eval(
    rowSel + constants.className,
    (el) => el.innerText
  );

  return config.classesToBook.some((thisClass) =>
    className.includes(thisClass)
  );
};

const classIsAvailable = async (page, rowSel) => {
  let availability = await page.$eval(
    rowSel + constants.bookButton,
    (el) => el.innerText
  );

  return availability === "BOOK" || availability === "WAITING LIST";
};
