import firebase from "./firestore";
// import bookingTicket from "./bookingTicket";

const firestore = firebase.firestore();

class bookingTicket {
  constructor(id, Date, classesToBook, timesToBook) {
    this.id = id;
    this.Date = Date;
    this.classesToBook = classesToBook;
    this.timesToBook = timesToBook;
  }
}

export const getTickets = async () => {
  try {
    const response = await firestore.collection("BookingTickets");
    const data = await response.get();
    let array = [];
    data.forEach((doc) => {
      const ticket = new bookingTicket(
        doc.id,
        doc.data().Date,
        doc.data().classesToBook,
        doc.data().timesToBook
      );

      array.push(ticket);
    });
    // console.log(array);
    return array;
  } catch (error) {
    throw error;
  }
};

export const addTicket = async (data) => {
  try {
    await firestore.collection("BookingTickets").doc(data.Date).set(data);
  } catch (error) {
    throw error;
  }
};

export const getTicket = async (id) => {
  try {
    const customer = await firestore.collection("BookingTickets").doc(id);
    const data = await customer.get();
    return data.data();
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (id, data) => {
  try {
    await firestore.collection("BookingTickets").doc(id).delete();
    await firestore.collection("BookingTickets").doc(data.Date).set(data);
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    await firestore.collection("BookingTickets").doc(id).delete();
  } catch (error) {
    throw error;
  }
};
