import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  mainGrid: {
    alignItems: "left",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  checkBox: {
    color: "#00a200",
  },
  formControl: {
    width: "100%",
  },
  checkBoxRoot: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxContainer: {
    paddingBottom: "20px",
    justifyContent: "center",
    padding: "5px",
  },
  FormLabel: {
    position: "absolute",
    top: -20,
    left: 10,
    width: "95px",
    // display: "block",
    whiteSpace: "nowrap",
    padding: "8px",
    paddingBottom: "0px",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "15px",
    marginTop: "0px",
  },
  chip: {
    margin: 5,
    padding: 2,
    marginInlineStart: 0,
    fontFamily: "Avenir Black, sans-serif",
    fontWeight: 500,
    fontSize: "0.9rem",
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));
