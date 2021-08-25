import React, { useEffect, useState, useRef } from "react";
import {
  TableContainer,
  Container,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import { DateTime } from "luxon";
import {
  getTickets,
  addTicket,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketBookingService";
import BookingModal from "./BookingModal";
// @ts-ignore
import { useStyles } from "./../style/BookingPageStyles";
import BookingTable from "./BookingTable";

export const getMinDate = () => {
  let timeNow = DateTime.utc();
  if (timeNow.hour < 7) {
    return timeNow.plus({ days: 8 }).toFormat("yyyy-MM-dd");
  } else {
    return timeNow.plus({ days: 9 }).toFormat("yyyy-MM-dd");
  }
};

const BookingPage = ({ user }) => {
  const classes = useStyles();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState(true);
  const [ticketID, setTicketID] = useState("");
  const [Date, setDate] = useState("");
  const [classesToBook, setClassesToBook] = useState([]);
  const [AM, setAM] = useState(Boolean);
  const [PM, setPM] = useState(Boolean);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTimes = (event) => {
    event.target.name === "AM"
      ? setAM(event.target.checked)
      : setPM(event.target.checked);
  };

  const handleDate = (event) => {
    setDate(event.toFormat("yyyy-MM-dd"));
  };

  const handleAddClass = (classToAdd) => {
    setClassesToBook([...classesToBook, classToAdd]);
  };

  const handleDeleteClass = (key, label) => {
    setClassesToBook((classesToBook) =>
      classesToBook.filter((thisClass) => thisClass !== key)
    );
  };

  const getlist = async () => {
    try {
      setLoading(true);
      const list = await getTickets();
      setTickets(list);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  const getOneTicket = async (id) => {
    try {
      setFormMode(false);
      setTicketID(id);
      const response = await getTicket(id);
      setDate(response.Date);
      setClassesToBook(response.classesToBook);
      setAM(response.timesToBook.AM);
      setPM(response.timesToBook.PM);
      setOpen(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteTicket(id);
      getlist();
      toast.success("Booking Ticket Deleted Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAdd = () => {
    // console.log("handle add");
    setOpen(true);
    setFormMode(true);
    setClassesToBook([]);
    setAM(false);
    setPM(false);
    setDate(getMinDate());
  };

  const addTicketHandler = async () => {
    try {
      const ticket = {
        Date,
        classesToBook,
        timesToBook: { AM: AM, PM: PM },
      };
      if (formMode) {
        await addTicket(ticket);
        toast.success("Booking Ticket Added Successfully");
        getlist();
        setOpen(false);
      } else {
        await updateTicket(ticketID, ticket);
        toast.success("Booking Ticket Updated Successfully");
        getlist();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getlist();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef?.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(!e.isIntersecting);
      },
      { threshold: [0, 1] }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    // clean up the observer
    return () => {
      observer.unobserve(sentinel);
    };
  }, [sentinelRef]);

  return (
    <div className={classes.main}>
      <br></br>
      <Container className={classes.mainContainer}>
        <Typography className={classes.greeting} variant="h3" component="div">
          Hello {user.displayName}
        </Typography>
        <TableContainer className={classes.greetingText}>
          <Typography
            className={classes.bookingInfo}
            variant="h6"
            component="div"
          >
            Bookings: Classes will be booked in the cloud at 06.50 on the date
            that they first become available (8 days before the class date).
          </Typography>
        </TableContainer>
        <ToastContainer />
      </Container>
      <div ref={sentinelRef}></div>
      <Container
        className={classes.stickyContainer}
        style={isSticky ? { backgroundColor: "#F7F7F7" } : {}}
      >
        <Grid container alignItems="center" className={classes.stickyHeader}>
          <Grid item xs={8}>
            <Typography
              className={classes.upcomingBookings}
              variant="h6"
              component="div"
            >
              Your upcoming bookings
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              onClick={handleAdd}
              className={classes.button}
              startIcon={<AddCircle />}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container
        className={classes.mainContainer}
        style={{ paddingBottom: "80px" }}
      >
        <BookingTable
          tickets={tickets}
          loadingState={loading}
          getOneTicket={getOneTicket}
          deleteHandler={deleteHandler}
        />
        <BookingModal
          open={open}
          close={handleClose}
          formmode={formMode}
          addTicket={addTicketHandler}
          Date={Date}
          changeDate={handleDate}
          classesToBook={classesToBook}
          addClassToBook={handleAddClass}
          deleteClassToBook={handleDeleteClass}
          AM={AM}
          PM={PM}
          changeTimesToBook={handleTimes}
        />
      </Container>
    </div>
  );
};

export default BookingPage;
