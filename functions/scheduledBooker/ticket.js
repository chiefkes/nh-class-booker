"use strict";

const { logger } = require("./logger.js");
const config = require("./config.js");
const { DateTime } = require("luxon");
const { startOfToday, startOfDayFromISO } = require("./date.js");
const admin = require("firebase-admin");
const db = admin.firestore();

async function checkTickets() {
  let match = null;
  const tickets = await db.collection("BookingTickets").get();
  tickets.forEach((ticket) => {
    let ticketData = ticket.data();
    let startOfTicketDay = startOfDayFromISO(ticketData.Date);

    if (ticketHasExpired(startOfTicketDay, startOfToday)) {
      logger(`Booking ticket on ${ticket.id} has expired`);
      if (config.booking.deleteExpiredTickets) {
        deleteTicket(ticket);
      }
    }
    if (ticketDateMatches(startOfTicketDay, startOfToday)) {
      config.booking.classesToBook = ticketData.classesToBook;
      config.booking.timesToBook = ticketData.timesToBook;
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
