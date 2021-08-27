import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  tableRoot: {
    marginTop: "40px",
    maxWidth: "100%",
    padding: "0px",
    // overflow: "hidden",
    position: "relative",
  },

  flexGrid: {
    padding: "10px",
    maxWidth: "800px",
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      minHeight: "130px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      minHeight: "80px",
    },
    alignItems: "center",
  },

  tableRow: {
    "&:nth-of-type(odd) > div > div": {
      backgroundColor: "#F9F9F9",
    },

    "&:nth-child(odd) > div > div > span:nth-child(1)": {
      backgroundColor: "#00a200",
    },

    "&:nth-of-type(even) > div > div": {
      backgroundColor: "#EEEEEE",
    },

    "&:nth-child(even) > div > div > span:nth-child(1)": {
      backgroundColor: "#388232",
    },

    display: "flex",
  },

  bookingMainInfo: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      minHeight: "130px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      minHeight: "80px",
    },
  },

  tableRowLoading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
    height: "100px",
    borderBottom: "none",
  },

  dateCol: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      maxWidth: "80px",
      minWidth: "80px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      maxWidth: "105px",
      minWidth: "105px",
    },
    padding: 0,
  },

  dateCell: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      maxWidth: "80px",
      minWidth: "80px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      maxWidth: "105px",
      minWidth: "105px",
    },
    display: "flex",
    height: "100%",
  },

  bookingDate: {
    fontFamily: "Avenir Black, sans-serif",
    color: "#ffffff",
    textAlign: "center",
    paddingTop: "20px",
    width: "100%",
  },

  weekDay: {
    display: "block",
    fontWeight: 700,
    fontSize: "1rem",
    lineHeight: "1.333",
  },

  shortDate: {
    textTransform: "uppercase",
    fontSize: "1rem",
    fontWeight: 500,
  },

  classesCell: {
    fontFamily: "Avenir Black, sans-serif",
    lineHeight: "1.25",
    letterSpacing: "-.02em",
    fontSize: "1.45rem",
    fontWeight: 600,
    display: "flex",
    textAlign: "left",
    padding: "0px 0px 10px 5px",
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      padding: "5px 0px 2.5px 3px",
      alignItems: "top",
      height: "90%",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      padding: "0px 0px 0px 5px",
      alignItems: "center",
      height: "100%",
    },
  },

  classText: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      lineHeight: "1.5",
      fontSize: "1.3rem",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      fontSize: "1.45rem",
      lineHeight: "1",
    },
    color: "#5F6062",
    fontSize: "1.45rem",
  },

  otherClassesText: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      fontSize: "0.95rem",
      alignItems: "top",
      marginTop: "5px",
      lineHeight: "1.2",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      fontSize: "1rem",
      marginTop: "5px",
      lineHeight: "1.2",
    },
    fontFamily: "Avenir Black, sans-serif",
    color: "#999999",
    fontStyle: "italic",
    marginTop: "0px",
    marginBottom: "0px",
  },

  otherClassesSpacer: {
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      display: "none",
    },
    fontSize: "0.95rem",
    alignItems: "top",
    marginTop: "2px",
    lineHeight: "1.2",
    marginBottom: "0px",
  },

  classesWrapper: {
    display: "block",
    padding: "5px",
  },

  timesCell: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      justifyContent: "left",
      padding: "7px 0px 3px 3px",
      fontSize: "0.95rem",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      justifyContent: "center",
      fontSize: "1rem",
    },
    height: "100%",
    display: "flex",
    fontFamily: "Avenir Black, sans-serif",
    lineHeight: "1",
    color: "#999999",
    fontWeight: 600,
    textAlign: "center",
    alignItems: "center",
  },

  editButton: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      alignItems: "center",
      bottom: "5px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      alignItems: "center",
      marginTop: "13px",
    },
    fontFamily: "Avenir Black, sans-serif",
    fontWeight: 600,
    color: "#00a200",
    width: "90px",
    height: "40px",
    display: "flex",
    left: "-8px",
    borderRadius: "20px",
  },

  CancelContainer: {
    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      alignItems: "flex-start",
      marginTop: "95px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      alignItems: "flex-start",
      marginTop: "32px",
    },
    right: "1%",
    width: "0px",
  },

  CancelButton: {
    "&:hover": {
      backgroundColor: "#00a200",
      color: "#FFFFFF",
    },

    // @ts-ignore
    [theme.breakpoints.down("992")]: {
      margin: "0px 13px 18px 0px",
    },
    // @ts-ignore
    [theme.breakpoints.up("992")]: {
      margin: "0px 13px 31px 0px",
    },
    position: "absolute",
    // height: "inherit",
    right: "1%",
    borderRadius: "20px",
    backgroundColor: "#FFFFFF",
    color: "#00a200",
    fontFamily: "Avenir Black, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 700,
  },
}));
