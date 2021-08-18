"use strict";

const { timeNowString } = require("./date.js");
// require("firebase-functions/lib/logger/compat");

const logger = (logInfo) => {
  console.log(logInfo);
};

exports.logger = logger;
