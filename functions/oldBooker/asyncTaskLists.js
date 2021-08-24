"use strict";

const constants = require("./constants.js");
const config = require("./config.js").booking;

exports.loginTasks = [
  /***************sequential***************/
  {
    task: "goto",
    url: constants.nhURL + "account/homepage",
    timeout: config.timeout + 3000,
    waitUntil: "domcontentloaded",
  },
  {
    task: "waitForTimeout",
    timeout: 1,
  },
  {
    task: "waitForSelector",
    selector: constants.cookieBar,
    timeout: config.timeout,
    visible: true,
  },
  {
    task: "clickSelector",
    selector: constants.cookieBar,
    wait: true,
  },
  /***************parallel***************/
  {
    task: "waitForSelector",
    selector: "body",
    timeout: config.timeout,
    visible: false,
  },
  {
    task: "waitForSelector",
    selector: "body > style",
    timeout: config.timeout,
    visible: false,
  },
  {
    task: "setFieldText",
    selector: "#email",
    value: config.userLogin,
  },
  {
    task: "setFieldText",
    selector: "#password",
    value: config.userPassword,
  },
  {
    task: "setCheckBox",
    selector: "#rememberMe",
  },
  /***************parallel***************/
  {
    task: "clickSelector",
    selector: "#next",
    wait: true,
  },
  {
    task: "waitForNavigation",
    timeout: config.timeout + 3000,
    waitUntil: "domcontentloaded",
  },
  /***************sequential***************/
  {
    task: "waitForSelector",
    selector: "body",
    timeout: config.timeout,
    visible: false,
  },
];

exports.timetableTasks = [
  {
    task: "goto",
    url: constants.nhURL + "gyms/kingston/timetable#/timetable",
    timeout: config.timeout + 3000,
    waitUntil: "domcontentloaded",
  },
  {
    task: "waitForSelector",
    selector: "body",
    timeout: config.timeout + 3000,
    visible: true,
  },
  {
    task: "waitForSelector",
    selector: "body",
    timeout: config.timeout + 3000,
    visible: true,
  },
  {
    task: "waitForTableLoading",
    timeout: config.timeout,
  },
  {
    task: "waitForSelector",
    selector: constants.tableHeader,
    timeout: config.timeout + 3000,
    visible: true,
  },
  {
    task: "waitForTableLoading",
    timeout: config.timeout,
  },
  {
    task: "waitForSelector",
    selector: constants.tableDescription,
    timeout: config.timeout + 3000,
    visible: true,
  },
  {
    task: "waitForTableLoading",
    timeout: config.timeout,
  },
];

exports.lastDateSelect = [
  {
    task: "clickSelector",
    selector: constants.lastDate,
    wait: true,
  },
  {
    task: "waitForTableLoading",
    timeout: config.timeout,
  },
  {
    task: "waitForTimeout",
    timeout: 1000,
  },
];

// const selectors = { rowSel: "", prevRowSel: "" };

// exports.classBooking = [
//   {
//     task: "scrollToSelector",
//     selector: selectors.prevRowSel + constants.className,
//   },
//   {
//     task: "generateScreenShot",
//     context: "classBooking - Before",
//   },
//   {
//     task: "clickSelector",
//     selector: selectors.rowSel + constants.bookButton,
//     wait: false,
//   },
//   {
//     task: "waitForTimeout",
//     timeout: 1000,
//   },
//   {
//     task: "waitForTableLoading",
//     timeout: config.timeout,
//   },
//   {
//     task: "waitForTimeout",
//     timeout: 1000,
//   },
//   {
//     task: "generateScreenShot",
//     context: "classBooking - After",
//   },
// ];

// exports.simulateClassBooking = [
//   {
//     task: "scrollToSelector",
//     selector: prevRowSel() + constants.className,
//   },
//   {
//     task: "generateScreenShot",
//     context: "classBooking - Before",
//   },
//   {
//     task: "colourSelector",
//     selector: selectors.rowSel + constants.bookButton,
//   },
//   {
//     task: "waitForTimeout",
//     timeout: 1000,
//   },
// ];
