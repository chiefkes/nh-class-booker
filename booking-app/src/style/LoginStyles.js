import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  greeting: {
    [theme.breakpoints.down("xs")]: {
      fontWeight: 300,
      fontSize: "1.8em",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "2.1em",
    },

    marginTop: "60px",
    textAlign: "center",
    padding: "0px",
    lineHeight: 1.2,
    textIndent: "-2px",
    color: "#5F6062",
    fontFamily: "Avenir Light, sans-serif",
    letterSpacing: "-.06em",
  },
  card: {
    marginTop: "35px",
    padding: "0px 20px 20px 20px",
  },
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#00a200",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    margin: theme.spacing(1),
  },
  formElement: {
    marginTop: "20px",
    marginBottom: "10px",
  },
  rememberCheckbox: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  submit: {
    "&:hover": {
      backgroundColor: "#388232",
      color: "#FFFFFF",
    },
    backgroundColor: "#00a200",
    fontFamily: "Avenir Black, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 700,
    borderRadius: "40px",
    color: "#FFFFFF",
    background: "#00a200",
    margin: "0px 0px 10px 0px",
  },
}));
