import React, { useState, useContext } from "react";
import GlobalReducerContext from "../contexts/GlobalReducerContext";
import getMinDate from "../utils/getMinDate";
import LuxonUtils from "@date-io/luxon";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Container,
} from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { FormControl } from "@material-ui/core";
import { useStyles } from "./../style/BookingModalStyles";
import MultiSelectChip from "./MultiSelectChip";

const allClasses = [
  "BODYPUMP™",
  "BODYATTACK™",
  "BODYBALANCE™",
  "BODYCOMBAT™",
  "Pilates",
  "SKILL HIIT",
  "SKILLROW",
];

const BookingModal = (props) => {
  const classes = useStyles();
  const [checkBoxError, setCheckBoxError] = useState(false);
  const [classError, setClassError] = useState(false);
  const [state, dispatch] = useContext(GlobalReducerContext);
  const {
    classesToBook,
    timesToBook,
    modalIsOpen,
    date,
    ticketMode,
    ticketID,
  } = state;

  const handleExit = () => {
    dispatch({ type: "MODAL", modalIsOpen: false });
    setCheckBoxError(false);
    setClassError(false);
  };

  const onSubmit = () => {
    if (classesToBook.length === 0) {
      setClassError(true);
      return;
    }
    if (!timesToBook.AM && !timesToBook.PM) {
      setCheckBoxError(true);
      return;
    }

    const ticket = {
      Date: date,
      classesToBook,
      timesToBook: timesToBook,
    };

    dispatch({
      type: ticketMode === "Add" ? "ADD_TICKET" : "UPDATE_TICKET",
      ticket,
      ticketID,
    });

    setCheckBoxError(false);
    setClassError(false);
  };

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      setCheckBoxError(false);
    }
    dispatch({
      type: "TIMES",
      timesToBook: { [event.target.name]: event.target.checked },
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      open={modalIsOpen}
      onClose={handleExit}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle>
        {ticketMode === "Add" ? "Add New" : "Update"} Booking Ticket
      </DialogTitle>
      <ValidatorForm onSubmit={onSubmit}>
        <DialogContent>
          <Grid container justify="center">
            <Grid item xs={12} style={{ marginBottom: "10px" }}>
              <MuiPickersUtilsProvider utils={LuxonUtils}>
                <DatePicker
                  fullWidth
                  disableToolbar
                  variant="inline"
                  label="Class Date"
                  minDate={getMinDate()}
                  autoOk={true}
                  invalidLabel={""}
                  inputVariant={"outlined"}
                  value={date}
                  format="EEE d MMM yyyy"
                  onChange={(event) =>
                    dispatch({
                      type: "DATE",
                      date: event.toFormat("yyyy-MM-dd"),
                    })
                  }
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="outlined" component="fieldset">
                <FormGroup row>
                  <Container className={classes.checkBoxContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timesToBook.AM}
                          onChange={handleCheckBox}
                          name="AM"
                          style={{ color: "#00a200" }}
                        />
                      }
                      label="AM"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timesToBook.PM}
                          onChange={handleCheckBox}
                          name="PM"
                          style={{ color: "#00a200" }}
                        />
                      }
                      label="PM"
                    />
                    {checkBoxError && (
                      <FormHelperText
                        style={{
                          color: "red",
                          paddingBottom: "10px",
                          marginLeft: "0px",
                        }}
                      >
                        Please pick a booking time!
                      </FormHelperText>
                    )}
                  </Container>
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <MultiSelectChip
                items={allClasses}
                selectedItems={classesToBook}
                onAddChip={(classToAdd) => {
                  setClassError(false);
                  dispatch({ type: "ADD_CLASS", classToAdd });
                }}
                onDeleteChip={(classToDel) =>
                  dispatch({ type: "REMOVE_CLASS", class: classToDel })
                }
              />
              {classError && (
                <FormHelperText
                  style={{
                    color: "red",
                    paddingBottom: "10px",
                    marginLeft: "4px",
                  }}
                >
                  Select at least one class!
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="secondary">
            {ticketMode}
          </Button>
          <Button onClick={handleExit} color="primary">
            Close
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
};

export default BookingModal;
