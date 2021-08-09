import { makeStyles } from "@material-ui/core";
// @ts-ignore
import backgroundImage from "./../media/account_landing_1500.jpg";

export const useStyles = makeStyles((theme) => ({
  mainContainer: {
    // minWidth: "100vw",
    [theme.breakpoints.down("xs")]: {
      width: "98%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "85%",
    },
    // paddingBottom: "80px",
    maxWidth: "1000px",
  },

  main: {
    position: "relative",
    minHeight: "90vh",
    marginTop: "0px",

    "&::before": {
      content: '" "',
      display: "block",
      position: "absolute",
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      opacity: 0.6,
      height: "100%",
      width: "100%",
      zIndex: "-1",
      overflow: "hidden",
    },
  },

  greetingText: {
    margin: "auto",
    marginBottom: "60px",
    background: "#DFDFDF",
  },

  stickyContainer: {
    minWidth: "100%",
    display: "flex",
    justifyContent: "center",
    margin: "0px",
    padding: "0px",
    position: "sticky",
    top: 0,
    zIndex: 2,
  },

  upcomingBookings: {
    [theme.breakpoints.down("xs")]: {
      fontWeight: 550,
    },
    [theme.breakpoints.up("sm")]: {
      fontWeight: 780,
    },
    flex: "1 1 100%",
    color: "#5F6062",
    fontFamily: "Avenir, sans-serif",
    fontStyle: "Black",
    lineHeight: 1.2,
    fontSize: "1.8rem",
  },

  stickyHeader: {
    [theme.breakpoints.down("xs")]: {
      width: "98%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "84%",
    },
    maxWidth: "995px",
    padding: "20px",
  },

  greeting: {
    [theme.breakpoints.down("xs")]: {
      fontWeight: 300,
      fontSize: "50px",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "60px",
      fontWeight: 100,
    },

    marginTop: "40px",
    flex: "1 1 100%",
    padding: "0px",
    paddingBottom: "50px",
    color: "#5F6062",
    fontFamily: "Avenir Light, sans-serif",
    // fontStyle: "light",
    letterSpacing: "-3.6px",
  },

  bookingInfo: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      fontWeight: 400,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "18px",
      fontWeight: 400,
    },
    flex: "1 1 100%",
    padding: "18px",
    color: "#5F6062",
    fontFamily: "Avenir Roman, sans-serif",
    fontStyle: "Roman",
  },

  button: {
    "&:hover": {
      backgroundColor: "#388232",
      color: "#FFFFFF",
    },
    backgroundColor: "#00a200",
    fontFamily: "Avenir Black, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 700,
    borderRadius: "20px",
    color: "#FFFFFF",
    marginRight: "4px",
    float: "right",
  },
}));
