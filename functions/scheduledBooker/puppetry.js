"use strict";
const constants = require("./constants.js");
const admin = require("firebase-admin");
const { timeNowFormat } = require("./date.js");
const bucket = admin.storage().bucket();
const config = require("./config.js").booking;

const clickSelector = async (page, selector, wait) => {
  if (wait) {
    await page.waitForSelector(selector, { visible: true });
  }
  await page.$eval(selector, (el) => el.click());
};

const colourSelector = async (page, selector) => {
  await page.$eval(selector, (el) => (el.style.backgroundColor = "#FDFF47"));
};

const scrollToSelector = async (page, selector) => {
  await page.waitForSelector(selector, { visible: true });
  await page.$eval(selector, (el) => el.scrollIntoView(true));
};

const setCheckBox = async (page, selector) => {
  await page.waitForSelector(selector, { visible: true });
  let n = 0;
  while (true) {
    n++;
    await page.$eval(selector, (el) => (el.checked = true));
    if ((await page.$eval(selector, (el) => el.checked)) === true) {
      break;
    }
    await page.waitForTimeout(500);
    if (n >= 20) {
      throw new Error("timeout trying to check the selector: " + selector);
    }
  }
};

const generateScreenShot = async (page, context) => {
  if (!config.screenShots) return;
  let imageBuffer = await page.screenshot();
  let date = timeNowFormat("yyyy'-'LL'-'dd");
  let time = timeNowFormat("HH'h'mm'm'ss's'");
  let file = bucket.file(
    `booking-screenshots/${date}/${time} - ${context}.png`
  );
  await file.save(imageBuffer);
};

const getPropertyValue = async (page, selector, property) => {
  await page.waitForSelector(selector, { visible: true });
  const [elementHandle] = await page.$$(selector);
  const propertyHandle = await elementHandle.getProperty(property);
  return await propertyHandle.jsonValue();
};

const setFieldText = async (page, selector, val) => {
  await page.waitForSelector(selector, { visible: true });
  let n = 0;
  while (true) {
    n++;
    await page.$eval(selector, (el, value) => (el.value = value), val);
    if ((await page.$eval(selector, (el) => el.value)) === val) {
      break;
    }
    await page.waitForTimeout(500);
    if (n >= 20) {
      throw new Error("timeout setting " + selector + " value to " + val);
    }
  }
};

const waitForTableLoading = async (page, ms) => {
  let timerHandle;
  function timeout() {
    return new Promise((_, reject) => {
      timerHandle = setTimeout(() => {
        reject();
      }, ms);
    });
  }

  async function tableLoadingCheck() {
    let isLoaded = 0;
    while (isLoaded === 0) {
      isLoaded = await page.$$eval(constants.bbLoading, (el) => el.length);
    }
  }

  try {
    await Promise.race([tableLoadingCheck(), timeout()]);
    clearTimeout(timerHandle);
  } catch (err) {
    clearTimeout(timerHandle);
    return Promise.reject("waitForTableLoading timed out");
  }
};

exports.clickSelector = clickSelector;
exports.colourSelector = colourSelector;
exports.scrollToSelector = scrollToSelector;
exports.setCheckBox = setCheckBox;
exports.getPropertyValue = getPropertyValue;
exports.setFieldText = setFieldText;
exports.waitForTableLoading = waitForTableLoading;
exports.generateScreenShot = generateScreenShot;
