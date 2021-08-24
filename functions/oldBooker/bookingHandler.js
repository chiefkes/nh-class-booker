"use strict";

const routines = require("./bookingRoutines.js");
const config = require("./config.js");
const puppeteer = require("puppeteer");
const fkill = require("fkill");
const findProcess = require("find-process");
const { logger } = require("./logger.js");
const { directAPIBooking } = require("./directAPIBooking.js");

exports.bookingHandler = class bookingHandler {
  constructor() {
    this.SSOToken = null;
    this._freshStart();
    this.results = {
      totalNumClassesBooked: 0,
      currNumClassesBooked: 0,
      browserErrors: 0,
      apiErrors: 0,
    };
  }

  _freshStart() {
    this.page = null;
    this.context = null;
    this.browser = null;
  }

  async runBooking() {
    switch (config.booking.bookingMode) {
      case "api":
        logger(`--- BOOKING MODE: API ---`);

        await this._retryHandler(this._apiBooking.bind(this));

        [this.results.totalNumClassesBooked, this.results.apiErrors] =
          await directAPIBooking(this.SSOToken);

        if (this.results.totalNumClassesBooked === 0) {
          console.error(
            `No available classes found during API booking (${
              config.booking.numBookingChecks + 1
            } attempts)`
          );
          console.log("Trying a browser automation booking...");
          await this._retryHandler(this._browserBooking.bind(this));
        }
        break;

      case "browser":
        logger(`--- BOOKING MODE: browser ---`);

        await this._retryHandler(this._browserBooking.bind(this));
        break;
    }

    // clean-up.. could move try / catch into _killChromium...
    try {
      await this._killChromium();
    } catch (err) {
      logger(`Browser Handler: Failed to kill Chromium process -> ${err}`);
    }

    // log-out results
    logger(
      `Total number of classes booked = ${this.results.totalNumClassesBooked}`
    );
    logger(
      `Browser Errors: ${this.results.browserErrors}, API Errors: ${this.results.apiErrors}`
    );

    // throw an exception if no classes booked which causes the entire Cloud Function to fail and trigger a retry
    if (this.results.totalNumClassesBooked === 0) {
      throw new Error("01");
    } else {
      return "success";
    }
  }

  async _apiBooking() {
    await routines.login(this.page);
    await this._getSSOToken();
    await this.page.close();
    await this.context.close();
    if (this.SSOToken != null && this.SSOToken.length == 236) return true;
    else return false;
  }

  async _getSSOToken() {
    logger(`---- Authorising API ----`);
    logger(`Getting SSO Token`);
    await this.page.waitForSelector("#bb > div", { visible: true });
    this.SSOToken = await this.page.$eval(
      "#bb > div",
      (el) => el.attributes[0].value
    );
  }

  async _browserBooking() {
    await routines.login(this.page);
    await routines.loadTimetable(this.page);
    await routines.selectLastDate(this.page);
    this.results.currNumClassesBooked = await routines.classBooking(this.page);
    await this.page.close();
    await this.context.close();
    if (
      this.results.currNumClassesBooked === 0 &&
      this.results.totalNumClassesBooked > 0
    ) {
      return true;
    } else {
      this.results.totalNumClassesBooked += this.results.currNumClassesBooked;
      return false;
    }
  }

  async _initBookingCycle() {
    this.browser ||
      (this.browser = await puppeteer.launch(
        config.browserHandler.PUPPETEER_OPTIONS
      ));
    await this._createNewPage();
    logger(`Chromium connection established`);
  }

  async _createNewPage() {
    this.context = await this.browser.createIncognitoBrowserContext();
    this.page = await this.context.newPage();
    await this.page.emulateTimezone("Europe/Athens");
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );
    this.page.setDefaultTimeout(config.booking.timeout);
    await this.page.setRequestInterception(true);
    this.page.on("request", (req) => {
      if (req.resourceType() == "font" || req.resourceType() == "image") {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async _retryHandler(bookingFunc) {
    for (
      let attempt = 0;
      attempt < config.booking.numBookingChecks;
      attempt++
    ) {
      try {
        await this._initBookingCycle();
        if (await bookingFunc()) break;
        logger(`End of ${bookingFunc.name} attempt ${attempt + 1}`);
      } catch (err) {
        this.results.browserErrors++;
        console.error(
          `${bookingFunc.name} Error ${this.results.browserErrors} -> ${err}`
        );
        await this._killChromium();
        if (this.results.browserErrors >= config.booking.errorRetries) {
          console.error(`Too many ${bookingFunc.name} errors!`);
          throw new Error("02");
        }
      }
    }
  }

  async _killChromium() {
    this._freshStart();
    let processList = await findProcess("name", "chromium");
    await processList.reduce(async (memo, process) => {
      if (process) {
        try {
          await memo;
          await fkill(process.pid, { force: true, tree: true });
        } catch {
          return;
        }
      }
    }, Promise.resolve());
  }
};
