import React, { useEffect } from "react";
import GlobalReducerContext from "../contexts/GlobalReducerContext";
import { useReducerAsync } from "use-reducer-async";
import Sticky from "./Sticky";
import BookingTable from "./BookingTable";
import {
  reducer,
  initialState,
  asyncActionHandlers,
} from "../reducers/globalReducer";
import {
  TableContainer,
  Container,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { ToastContainer } from "react-toastify";
import BookingModal from "./BookingModal";
import { useStyles } from "./../style/BookingPageStyles";

function BookingPage({ user }) {
  const classes = useStyles();
  const [state, dispatch] = useReducerAsync(
    reducer,
    initialState,
    asyncActionHandlers
  );

  useEffect(() => {
    dispatch({ type: "GET_TICKETS" });
  }, [dispatch]);

  return (
    <GlobalReducerContext.Provider value={[state, dispatch]}>
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
        <Sticky>
          {(isSticky) => (
            <Container
              className={classes.stickyContainer}
              style={{ backgroundColor: isSticky && "#F7F7F7" }}
            >
              <Grid
                container
                alignItems="center"
                className={classes.stickyHeader}
              >
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
                    onClick={() => dispatch({ type: "MODAL_ADD" })}
                    className={classes.button}
                    startIcon={<AddCircle />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Container>
          )}
        </Sticky>
        <Container
          className={classes.mainContainer}
          style={{ paddingBottom: "80px" }}
        >
          <BookingTable />
          <BookingModal />
        </Container>
      </div>
    </GlobalReducerContext.Provider>
  );
}

export default BookingPage;
