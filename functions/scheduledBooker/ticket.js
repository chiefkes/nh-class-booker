"use strict";

const { logger } = require("../old/logger.js");
const config = require("../old/config.js");
const { DateTime } = require("luxon");
const { today } = require("../old/date.js");
const admin = require("firebase-admin");
const db = admin.firestore();

async function checkTickets() {
  let match = null;
  const startOfToday = today.startOf("day");
  const tickets = await db.collection("BookingTickets").get();
  tickets.forEach((ticket) => {
    let ticketObj = ticket.data();
    let startOfTicketDay = DateTime.fromISO(ticketObj.Date)
      .setLocale("en-GB")
      .setZone("Europe/London")
      .startOf("day");

    if (ticketHasExpired(startOfTicketDay, startOfToday)) {
      logger(`Booking ticket on ${ticket.id} has expired`);
      if (config.booking.deleteExpiredTickets) {
        deleteTicket(ticket);
      }
    }
    if (ticketDateMatches(startOfTicketDay, startOfToday)) {
      config.booking.classesToBook = ticketObj.classesToBook;
      config.booking.timesToBook = ticketObj.timesToBook;
      match = ticket;
    }
  });
  if (match)
    console.log(
      "Found a booking ticket matching today's date:",
      config.booking.classesToBook,
      config.booking.timesToBook
    );
  else logger("No booking ticket for today. Exiting...");
  return match;
}

const ticketDateMatches = (startOfTicketDay, startOfToday) => {
  if (startOfTicketDay.equals(startOfToday.plus({ days: 8 }))) {
    return true;
  }
  return false;
};

const ticketHasExpired = (startOfTicketDay, startOfToday) => {
  if (startOfTicketDay < startOfToday.plus({ days: 8 })) {
    return true;
  }
  return false;
};

function deleteTicket(ticket) {
  logger(`Deleting ticket...`);
  ticket.ref
    .delete()
    .then(() => {
      logger(`Successfully deleted booking ticket: ${ticket.id}`);
    })
    .catch((error) => {
      logger(`Error deleting booking ticket: ${ticket.id}`);
    });
}

module.exports = {
  checkTickets,
  deleteTicket,
};
