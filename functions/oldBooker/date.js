"use strict";

const { DateTime } = require("luxon");

const timeNowString = (format) => {
  return DateTime.utc()
    .setLocale("en-GB")
    .setZone("Europe/London")
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
};

const timeNowFormat = (format) => {
  return DateTime.utc()
    .setLocale("en-GB")
    .setZone("Europe/London")
    .toFormat(format);
};

const timeNowMillis = () => {
  return DateTime.utc().setLocale("en-GB").setZone("Europe/London").toMillis();
};

const millisFromFormat = (string) => {
  return DateTime.fromFormat(string, "HH:mm", {
    zone: "Europe/London",
    setZone: true,
    locale: "en-GB",
  })
    .setLocale("en-GB")
    .setZone("Europe/London")
    .toMillis();
};

const today = DateTime.utc().setLocale("en-GB").setZone("Europe/London");
const timetableDateString = today.plus({ days: 8 }).toFormat("yyyy-MM-dd");
const todayDateString = today.toFormat("yyyy-MM-dd");

module.exports = {
  timeNowString,
  timeNowFormat,
  timeNowMillis,
  millisFromFormat,
  today,
  timetableDateString,
  todayDateString,
};
