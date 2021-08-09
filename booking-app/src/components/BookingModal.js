import React from "react";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Menu,
  Grid,
  Chip,
  MenuItem,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Container,
} from "@material-ui/core";
import { AddCircle, HighlightOff } from "@material-ui/icons";
import { ValidatorForm } from "react-material-ui-form-validator";
import { getMinDate } from "./BookingPage";
import { FormControl } from "@material-ui/core";
import { useStyles } from "./../style/BookingModalStyles";

const BookingModal = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [checkBoxError, setCheckBoxError] = React.useState(false);
  const [classError, setClassError] = React.useState(false);
  const allClasses = [
    "BODYPUMP™",
    "BODYATTACK™",
    "BODYBALANCE™",
    "Pilates",
    "Swimming-Family",
    "Swimming-Kids Pool",
    "Swimming-Adult",
  ];
  const numGymClasses = allClasses.length;

  const handleAddButton = (event) => {
    if (props.classesToBook.length >= numGymClasses) return;
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (menuItem) => {
    setAnchorEl(null);
    setClassError(false);
    props.addClassToBook(menuItem);
  };

  const handleDialogClose = () => {
    props.close();
    setCheckBoxError(false);
    setClassError(false);
  };

  const onSubmit = () => {
    if (props.classesToBook.length === 0) {
      setClassError(true);
      return;
    }
    if (!props.AM && !props.PM) {
      setCheckBoxError(true);
      return;
    }
    props.addTicket();
    setCheckBoxError(false);
    setClassError(false);
  };

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      setCheckBoxError(false);
    }
    props.changeTimesToBook(event);
  };

  return (
    <Dialog
      maxWidth="sm"
      open={props.open}
      onClose={props.close}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle>
        {props.formmode ? "Add New" : "Update"} Booking Ticket
      </DialogTitle>
      <ValidatorForm onSubmit={onSubmit}>
        <DialogContent>
          <Grid container justify="center" className={classes.mainGrid}>
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
                  value={props.Date}
                  format="EEE d MMM yyyy"
                  onChange={props.changeDate}
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="outlined" component="fieldset">
                <FormGroup row className={"classes.checkBoxRoot"}>
                  <Container className={classes.checkBoxContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={props.AM}
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
                          checked={props.PM}
                          onChange={handleCheckBox}
                          name="PM"
                          style={{ color: "#00a200" }}
                        />
                      }
                      label="PM"
                    />
                    {checkBoxError ? (
                      <FormHelperText
                        style={{
                          color: "red",
                          paddingBottom: "10px",
                          marginLeft: "0px",
                        }}
                      >
                        Please pick a booking time!
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </Container>
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <div className={classes.chips}>
                {props.classesToBook.map((thisClass, i = 1) => {
                  return (
                    <Chip
                      deleteIcon={
                        <HighlightOff
                          style={{
                            color: "#FFFFFF",
                          }}
                        />
                      }
                      style={{
                        backgroundColor: "#00a200",
                        color: "#FFFFFF",
                      }}
                      className={classes.chip}
                      label={thisClass}
                      key={thisClass}
                      data-label={thisClass}
                      onDelete={() => props.deleteClassToBook(thisClass)}
                    />
                  );
                })}
                {props.classesToBook.length < numGymClasses ? (
                  <Chip
                    key={"add-class"}
                    label={"Add Class"}
                    onClick={handleAddButton}
                    className={classes.chip}
                    color={"primary"}
                    icon={<AddCircle />}
                  />
                ) : (
                  <></>
                )}
              </div>
              {classError ? (
                <FormHelperText
                  style={{
                    color: "red",
                    paddingBottom: "10px",
                    marginLeft: "4px",
                  }}
                >
                  Select at least one class!
                </FormHelperText>
              ) : (
                ""
              )}
              <Menu
                id="class-dropdown"
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                open={Boolean(anchorEl)}
              >
                {allClasses
                  .filter(
                    (thisClass) => !props.classesToBook.includes(thisClass)
                  )
                  .map((thisClass) => {
                    return (
                      <MenuItem
                        onClick={() => handleMenuClose(thisClass)}
                        key={thisClass}
                        value={thisClass}
                      >
                        {thisClass}
                      </MenuItem>
                    );
                  })}
              </Menu>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="secondary">
            {props.formmode ? "Add" : "Update"}
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
};

export default BookingModal;
