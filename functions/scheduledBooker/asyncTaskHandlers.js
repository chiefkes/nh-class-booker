"use strict";

const puppetry = require("./puppetry.js");
const { logger } = require("./logger.js");

exports.asyncEach = async (page, arrThingsToDo) => {
  await Promise.all(
    arrThingsToDo.map(async (thing) => {
      await runTasks(page, thing, "asyncEach");
    })
  );
};

exports.asyncEachSeries = async (page, arrThingsToDo) => {
  await arrThingsToDo.reduce(async (memo, thing) => {
    await memo;
    await runTasks(page, thing, "asyncEachSeries");
  }, Promise.resolve());
};

const runTasks = async (page, thing, asyncType) => {
  try {
    switch (thing.task) {
      case "goto":
        await page.goto(thing.url, {
          timeout: thing.timeout,
          waitUntil: thing.waitUntil,
        });
        break;
      case "waitForTimeout":
        await page.waitForTimeout(thing.timeout);
        break;
      case "waitForSelector":
        await page.waitForSelector(thing.selector, {
          timeout: thing.timeout,
          visible: thing.visible,
        });
        break;
      case "waitForTableLoading":
        await puppetry.waitForTableLoading(page, thing.timeout);
        break;
      case "clickSelector":
        await puppetry.clickSelector(page, thing.selector, thing.wait);
        break;
      case "setFieldText":
        await puppetry.setFieldText(page, thing.selector, thing.value);
        break;
      case "setCheckBox":
        await puppetry.setCheckBox(page, thing.selector);
        break;
      case "waitForNavigation":
        await page.waitForNavigation({
          timeout: thing.timeout,
          waitUntil: thing.waitUntil,
        });
        break;
      case "generateScreenShot":
        await puppetry.generateScreenShot(page, thing.context);
        break;
      // case "scrollToSelector":
      //   await puppetry.scrollToSelector(page, thing.selector);
      //   break;
      // case "colourSelector":
      //   await puppetry.colourSelector(page, thing.selector);
      //   break;
    }
    logger(
      `completed ${asyncType} op: ${thing.task} => ${
        thing.selector || thing.url || thing.timeout || thing.context
      }`
    );
  } catch {
    throw new Error(
      `failed ${asyncType} op: ${thing.task} => ${
        thing.selector || thing.url || thing.timeout || thing.context
      }`
    );
  }
};
