import getMinDate from "../utils/getMinDate";
import { toast } from "react-toastify";
import {
  getTickets,
  addTicket,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../services/api";

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "MODAL":
      return { ...state, modalIsOpen: action.modalIsOpen };
    case "TICKETS":
      return { ...state, tickets: action.tickets, loading: false };
    case "MODAL_ADD":
      return {
        ...state,
        ticketMode: "Add",
        classesToBook: [],
        timesToBook: { AM: false, PM: false },
        date: getMinDate(),
        modalIsOpen: true,
      };
    case "MODAL_UPDATE_START":
      return { ...state, ticketID: action.ticketID, ticketMode: "Update" };
    case "MODAL_UPDATE_FINISH":
      return {
        ...state,
        date: action.date,
        classesToBook: action.classesToBook,
        timesToBook: action.timesToBook,
        modalIsOpen: true,
      };
    case "ADD_CLASS":
      return {
        ...state,
        classesToBook: [...state.classesToBook, action.classToAdd],
      };
    case "REMOVE_CLASS":
      return {
        ...state,
        classesToBook: state.classesToBook.filter(
          (thisClass) => thisClass !== action.key
        ),
      };
    case "TIMES":
      return {
        ...state,
        timesToBook: { ...state.timesToBook, ...action.timesToBook },
      };
    case "DATE":
      return { ...state, date: action.date };
    case "ERROR":
      toast.error(action.error.message);
      return {
        ...state,
        error: action.error,
        loading: false,
        // modalIsOpen: false,
      };
    default:
      throw new Error("Unsupported action in reducer");
  }
};

export const asyncActionHandlers = {
  GET_TICKETS:
    ({ dispatch }) =>
    async (action) => {
      try {
        await getList(dispatch);
      } catch (error) {
        dispatch({ type: "ERROR", error });
      }
    },
  GET_TICKET:
    ({ dispatch }) =>
    async (action) => {
      try {
        dispatch({ type: "MODAL_UPDATE_START", ticketID: action.ticketID });
        const { Date, classesToBook, timesToBook } = await getTicket(
          action.ticketID
        );
        dispatch({
          type: "MODAL_UPDATE_FINISH",
          date: Date,
          classesToBook,
          timesToBook,
        });
      } catch (error) {
        dispatch({ type: "ERROR", error });
      }
    },
  ADD_TICKET:
    ({ dispatch }) =>
    async (action) => {
      try {
        console.log(action.ticket);
        await addTicket(action.ticket);
        toast.success("Booking Ticket Added Successfully");
        await getList(dispatch);
        dispatch({ type: "MODAL", modalIsOpen: false });
      } catch (error) {
        dispatch({ type: "ERROR", error });
      }
    },
  UPDATE_TICKET:
    ({ dispatch }) =>
    async (action) => {
      try {
        await updateTicket(action.ticketID, action.ticket);
        toast.success("Booking Ticket Updated Successfully");
        await getList(dispatch);
        dispatch({ type: "MODAL", modalIsOpen: false });
      } catch (error) {
        dispatch({ type: "ERROR", error });
      }
    },
  DELETE_TICKET:
    ({ dispatch }) =>
    async (action) => {
      try {
        await deleteTicket(action.ticketID);
        await getList(dispatch);
      } catch (error) {
        dispatch({ type: "ERROR", error });
      }
    },
};

async function getList(dispatch) {
  dispatch({ type: "LOADING" });
  const tickets = await getTickets();
  dispatch({ type: "TICKETS", tickets });
}

export const initialState = {
  tickets: [],
  loading: false,
  modalIsOpen: false,
  ticketMode: "Add",
  ticketID: null,
  date: null,
  classesToBook: [],
  timesToBook: { AM: false, PM: false },
};
