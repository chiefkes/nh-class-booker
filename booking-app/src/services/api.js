import firebaseApp from "./firebase";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
} from "@firebase/firestore/lite";
const db = getFirestore(firebaseApp);
const ticketsRef = collection(db, "BookingTickets");

function bookingTicket(id, Date, classesToBook, timesToBook) {
  this.id = id;
  this.Date = Date;
  this.classesToBook = classesToBook;
  this.timesToBook = timesToBook;
}

export const getTickets = async () => {
  try {
    let array = [];
    const querySnapshot = await getDocs(ticketsRef);
    querySnapshot.forEach((doc) => {
      const ticket = new bookingTicket(
        doc.id,
        doc.data().Date,
        doc.data().classesToBook,
        doc.data().timesToBook
      );

      array.push(ticket);
    });
    return array;
  } catch (error) {
    throw error;
  }
};

export const addTicket = async (data) => {
  try {
    await setDoc(doc(ticketsRef, data.Date), data);
  } catch (error) {
    throw error;
  }
};

export const getTicket = async (id) => {
  try {
    const docRef = doc(ticketsRef, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error(`No with id ${id} does not exist`);
    }
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (id, data) => {
  try {
    if (id !== data.Date) {
      await deleteDoc(doc(ticketsRef, id));
    }
    await setDoc(doc(ticketsRef, data.Date), data);
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    await deleteDoc(doc(ticketsRef, id));
  } catch (error) {
    throw error;
  }
};
