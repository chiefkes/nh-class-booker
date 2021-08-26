import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  greeting: {
    [theme.breakpoints.down("xs")]: {
      fontWeight: 300,
      fontSize: "1.8em",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "2.1em",
      // fontWeight: 100,
    },

    marginTop: "60px",
    flex: "1 1 100%",
    padding: "0px",
    lineHeight: 1.2,
    textIndent: "-2px",
    color: "#5F6062",
    fontFamily: "Avenir Light, sans-serif",
    letterSpacing: "-.06em",
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
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    backgroundColor: "#00a200",
    fontFamily: "Avenir Black, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 700,
    borderRadius: "40px",
    color: "#FFFFFF",
    background: "#00a200",
    marginTop: "0px",
    marginBottom: "10px",
  },
  card: {
    marginTop: "35px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
  },
  pointer: {
    cursor: "pointer",
    color: "red",
  },
}));
