<h1 align="center">
  <br>
  <a href="https://nuffield-health-class-booker.web.app/">
    <img src="./booking-app/src/bp_logo.svg" width="250"/>
  </a>
</h1>

<h4 align="center">
  A booking automation service using <a href="https://reactjs.org/">React.js</a>, <a href="https://developers.google.com/web/tools/puppeteer">Puppeteer</a> and <a href="https://firebase.google.com/">Google Firebase</a>.
</h4>

<p align="center">
    <a href="https://github.com/chiefkes/bodypump-booker-cloud/commits/master">
    <img src="https://img.shields.io/github/last-commit/chiefkes/bodypump-booker-cloud.svg?style=flat-square&logo=github&logoColor=white"
         alt="GitHub last commit">
    <a href="https://github.com/chiefkes/bodypump-booker-cloud/issues">
    <img src="https://img.shields.io/github/issues-raw/chiefkes/bodypump-booker-cloud.svg?style=flat-square&logo=github&logoColor=white"
         alt="GitHub issues">
    <a href="https://github.com/chiefkes/bodypump-booker-cloud/pulls">
    <img src="https://img.shields.io/github/issues-pr-raw/chiefkes/bodypump-booker-cloud.svg?style=flat-square&logo=github&logoColor=white"
         alt="GitHub pull requests">
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-the-booking-app">The Booking App</a> •
  <a href="#-the-cloud-function">The Cloud Function</a>
</p>

---

## 🤖 About

**NH Class Booker** is a bespoke (at the moment) booking service that takes the stress out of securing sought-after gym classes. The project comprises a web-app for queuing and managing **booking tickets**, and a Google Cloud Function that executes the booking itself through HTTP requests (or alternatively through the power of headless chromium automation). All of this is done remotely in a Google-managed Node.js runtime environment at a time that maximises the odds of a successful booking - so that you can get a good lie-in 😴🛏️🏃‍♀️

## 🎫 The Booking App

```
nh-class-booker
└─ booking-app
```

### Demo

Check it out: https://nuffield-health-class-booker.web.app/ (CRUD functionality disabled)

```
Email: github@github.com
Password: github
```

The webapp uses [React.js](https://reactjs.org/) and [Material-UI](https://material-ui.com/) as a base, and is bootstrapped with [Create React App](https://create-react-app.dev/). Authentication is handled using the [Firebase SDK](https://firebase.google.com/docs/auth). The UI takes its design cue from the particular gym website to which the bookings are being made, with extra attention paid to closely modelling the responsive behaviour of the table that displays the booking tickets.

![screenshot](./docs/BookingApp-Responsive-Showcase.gif)

### Features

1. CRUD: users can view, add, update and delete Booking Tickets
2. Booking Tickets are stored in a [Firestore](https://firebase.google.com/docs/firestore) NoSQL database.
3. Material-UI components used as a base for user input functionality.

![screenshot](./docs/BookingApp-CRUD-Operations.gif)

## ☁ The Cloud Function

### Overview

The Booking Automation [Cloud Function](https://firebase.google.com/docs/functions) runs at 06:50 each morning; checks whether there are any actionable Booking Tickets and if so initiates the main booking loop. Here several attempts are made at booking the classes either [with HTTP requests](#booking-directly-with-http-requests-to-the-api) to the Gym's booking API, or by using [headless chrome automation](#booking-with-headless-browser-automation). The function exits once a successful booking has been confirmed, or in the case that the process has exceeded a configurable timeout.

### What's inside?

```
nh-class-booker
└─ functions
   ├─ index.js
   ├─ jsconfig.json
   ├─ package-lock.json
   ├─ package.json
   └─ scheduledBooker
      ├─ asyncTaskHandlers.js
      ├─ asyncTaskLists.js
      ├─ bookingHandler.js
      ├─ bookingRoutines.js
      ├─ config.js
      ├─ constants.js
      ├─ date.js
      ├─ directAPIBooking.js
      ├─ logger.js
      ├─ onRun.func.js
      ├─ puppetry.js
      ├─ ticket.js
      └─ wait.js

```

- **`index.js`**:

  - The functions exported in this file define all of the Cloud Functions for a Firebase project.
  - In this case the npm package [`firebase-function-tools`](https://www.npmjs.com/package/firebase-function-tools) does some heavy-lifting by recursing the `./functions` directory and automatically including any files with `.func.js` in their filename as separate Cloud Functions. This future-proofs the project, allowing for functions to be split into multiple files as well as using the `process.env.FUNCTION_TARGET` environment variable to selectively load dependencies, thus reducing Cloud Function cold start times. See [here](https://github.com/firebase/functions-samples/issues/170) for further discussion.

- **`scheduledBooker/onRun.func.js`**:

  - Contains the main booking automation cloud function definition.
  - This function is configured with a [Pub/Sub](https://cloud.google.com/scheduler/docs/tut-pub-sub) trigger that is invoked by a [Cloud Scheduler](https://cloud.google.com/scheduler/docs) Job at 06:50AM each morning.
  - The function has a top-level retry mechanism using the Cloud Function [retries](https://cloud.google.com/functions/docs/bestpractices/retries) policy, which causes the function to re-execute if the main booking loop fails to book anything or exceeds the 9 minute Cloud Function timeout restriction. `checkRetryTimeout()` prevents retrying the function indefinitely.
  - The configuration variable `bookingMode` determines whether to:

    a. [book directly](#booking-directly-with-http-requests-to-the-api) (via HTTP Requests to the Gym's booking API)

    b. [emulate a booking on the Gym's website](#booking-with-headless-browser-automation) (with headless browser automation).

- **`scheduledBooker/ticket.js`**:

  - `bookingTicketChecker` queries the Firestore database for an actionable Booking ticket, and performs database cleanup operations

---

#### Booking directly with HTTP Requests to the API

- **`scheduledBooker/directAPIBooking.js`**:
  - the exported function `directAPIBooking()` contains the main booking loop and logic to determine whether booking has been successful
  - `getAuthToken()` submits an HTTP request with the user's `SSO Token` and stores the `Auth-Token` that is received for subsequent API calls. See [API spec](https://api-docs.jrni.com/v5/authentication/single-sign-on).
  - `getBookedClassDatetimes()` requests a list of the users currently booked classes and returns an array of their `datetimes`.
  - `getAvailClasses()` requests a list of the all the classes at the Gym in 8 days time, and returns an array of classes that match the `booking ticket` parameters.
  - `bookclasses()` adds each one of the available classes to the user's basket and POSTS a checkout call to execute the booking. See [API spec](https://api-docs.jrni.com/v5/basket_api#/)

---

#### Booking with headless browser automation

- **`scheduledBooker/bookingHandler.js`**:

  - the `bookingHandler` class handles both the headless browser automation side of things as well as the core logic of booking attempts.
  - Headless browser automation is achieved using Google's [Puppeteer](https://developers.google.com/web/tools/puppeteer) library.
  - after calling the `runBooking()` method, the bulk of the work happens in the big `for-loop` in the `_mainBookingLoop()` method. Each iteration:
    - creates a fresh incognito chromium page (so that each booking attempt involves logging into the gym website afresh, avoiding occasional issues with the gym website's login cookie implementation)
    - collects the results of `_mainBookingRoutines()` to determine whether the booking has been successful and the loop can be exited
    - implements a `try / catch` mechanism to collect and log any errors / timeouts that occur further down the line in the booking routines and their asynchronous task lists.
    - Errors trigger `_killChromium()` which kills all instances of the Chromium process using the cross-platform node packages [`fkill`](https://www.npmjs.com/package/fkill) and [`find-process`](https://www.npmjs.com/package/find-process). Although a relatively drastic measure, this seems to be the only 100% reliable way of avoiding unforeseen issues with chromium crashes and hung processes (that could rack up Google Cloud costs). In the case of crashes, the `_initBookingCycle()` ensures a fresh instance of Chromium is created for the next booking attempt cycle.

- **`scheduledBooker/bookingRoutines.js`**:

  - contains the functions that co-ordinate the running-through of headless browser automation tasks.
  - most automation tasks are stored as arrays in `scheduledBooker/asyncTaskLists.js` and executed asynchronously in parallel or series with the `asyncEach` and `asyncEachSeries` task handlers in `scheduledBooker/asyncTaskHandlers.js`

- **`scheduledBooker/asyncTaskHandlers.js`**:

  - functions to execute asynchronous operations either in series (using `arr.reduce()`) or in parallel (with `await Promise.all()`)

- **`scheduledBooker/asyncTaskLists.js`**:

  - automation tasks to be carried out by the async task handlers

- **`scheduledBooker/puppetry.js`**:

- custom Puppeteer automation methods.

---

#### Util Functions

- **`scheduledBooker/logger.js`**:

  - simple logging function

- **`scheduledBooker/date.js`**:

  - datetime stuff (using [Luxon](https://moment.github.io/luxon/index.html))

- **`scheduledBooker/config.js`**:

  - shared config object. Config values are stored in a Firestore collection and retrieved in `scheduledBooker/onRun.func.js` when the Cloud Functions first starts. This allows for tweaking settings on-the-fly without having to re-deploy the entire Cloud Function.

- **`scheduledBooker/constants.js`**:

  - a list of CSS selectors used when Puppeteer interacts with the DOM.
