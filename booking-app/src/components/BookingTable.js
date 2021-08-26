import React, { useContext } from "react";
import GlobalReducerContext from "../contexts/GlobalReducerContext";
import { DateTime } from "luxon";
import { Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Col, Grid, Row } from "react-flexbox-grid";
import { BeatLoader } from "react-spinners";
import { useStyles } from "./../style/BookingTableStyles";

const BookingTable = () => {
  const [state, dispatch] = useContext(GlobalReducerContext);
  const { tickets, loading } = state;
  const classes = useStyles();
  const override = `
    display: flex;
    align-items: center;
    justify-content: center;    
    // border-color: red;
    `;
  return (
    <div className={classes.tableRoot}>
      <div>
        {tickets.length === 0 ? (
          <div className={classes.tableRowLoading}>
            <div>
              <BeatLoader
                css={override}
                // size={150}
                color={"#1BA500"}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          <>
            {tickets.map((ticket) => (
              <div key={ticket.id} className={classes.tableRow}>
                <Row style={{ margin: "0px", padding: "0px", width: "100%" }}>
                  <>
                    <Col xs={2.5} className={classes.dateCol}>
                      <span className={classes.dateCell}>
                        <div className={classes.bookingDate}>
                          <span key="weekday" className={classes.weekDay}>
                            {DateTime.fromISO(ticket.Date).weekdayShort}
                          </span>
                          <span className={classes.shortDate} key="shortDate">
                            {DateTime.fromISO(ticket.Date).day}{" "}
                            {DateTime.fromISO(ticket.Date).monthShort}
                          </span>
                        </div>
                      </span>
                    </Col>
                    <Col xs={7.5}>
                      <Grid fluid className={classes.flexGrid}>
                        <Row className={classes.bookingMainInfo}>
                          <Col xs={12} sm={12} md={12} lg={2}>
                            <div className={classes.timesCell}>
                              <div>{renderTimesText(ticket)}</div>
                            </div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={5}>
                            <div className={classes.classesCell}>
                              <div>
                                <span className={classes.classText}>
                                  {ticket.classesToBook[0]}
                                </span>
                                {ticket.classesToBook.length > 1 ? (
                                  <pre className={classes.otherClassesText}>
                                    {"+ "}
                                    {ticket.classesToBook.length - 1}
                                    {ticket.classesToBook.length >= 3
                                      ? " OTHERS"
                                      : " OTHER"}
                                  </pre>
                                ) : (
                                  <pre className={classes.otherClassesSpacer}>
                                    {" "}
                                  </pre>
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={4}>
                            <div className={classes.editButton}>
                              <Button
                                onClick={() =>
                                  dispatch({
                                    type: "GET_TICKET",
                                    ticketID: ticket.id,
                                  })
                                }
                                className={classes.editButton}
                                startIcon={<Edit />}
                              >
                                Edit
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Grid>
                    </Col>
                  </>
                </Row>

                <div className={classes.CancelContainer} style={{}}>
                  <Button
                    onClick={() =>
                      dispatch({ type: "DELETE_TICKET", ticketID: ticket.id })
                    }
                    variant="contained"
                    color="primary"
                    disableElevation
                    aria-label="cancel booking ticket"
                    className={classes.CancelButton}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const renderTimesText = (ticket) => {
  let string = "";
  if (ticket.timesToBook.AM) {
    string += "06:30 - ";
    if (ticket.timesToBook.PM) string += "22:00";
    else string += "12:00";
  } else if (ticket.timesToBook.PM) string += "12:00 - 22:00";
  return string;
};

export default BookingTable;
