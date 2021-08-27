import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  checkBoxContainer: {
    padding: "5px 5px 20px 5px",
  },
  checkBox: {
    color: "#00a200",
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
}));
