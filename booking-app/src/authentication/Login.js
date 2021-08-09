import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  FormControlLabel,
  Button,
  Checkbox,
  makeStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import { LockRounded } from "@material-ui/icons";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import firebase from "./../services/firestore";
const firestore = firebase.firestore();

const Login = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const override = `
        display: flex;
        border-color: red;
        align-items: center;
        justify-content: center;
    `;

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleCheck = (event) => {
    setRememberMe(event.target.checked);
  };

  const handlerLogin = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        firestore
          .collection("users")
          .doc(response.user.uid)
          .get()
          .then((doc) => {
            const firstName = doc.data().firstName;
            const { user } = response;
            const data = {
              userId: user.uid,
              email: user.email,
              firstName: firstName,
            };
            localStorage.setItem("user", JSON.stringify(data));
            const storage = localStorage.getItem("user");
            const loggedInUser = storage !== null ? JSON.parse(storage) : null;
            props.loggedIn(loggedInUser);
            setLoading(false);
          });
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography className={classes.greeting} variant="h3" component="div">
        Log in to BodyPump Booker
      </Typography>
      <Card className={classes.card}>
        <CardContent>
          <ToastContainer />
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockRounded />
            </Avatar>
            {/* <Typography component="h1" variant="h5">
              Sign In
            </Typography> */}
            <ValidatorForm
              onSubmit={handlerLogin}
              onError={(errors) => {
                for (const err of errors) {
                  console.log(err.props.errorMessages[0]);
                }
              }}
              className={classes.form}
            >
              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                onChange={handleEmail}
                name="email"
                value={email}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
                autoComplete="off"
                className={classes.formElement}
              />
              <TextValidator
                variant="outlined"
                fullWidth
                label="Password"
                onChange={handlePassword}
                name="password"
                type="password"
                value={password}
                validators={["required"]}
                errorMessages={["this field is required"]}
                autoComplete="off"
                className={classes.formElement}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value={rememberme}
                    onChange={(e) => handleCheck(e)}
                    color="primary"
                  />
                }
                label="Keep me signed in"
                className={classes.rememberCheckbox}
              />
              {loading ? (
                <BeatLoader
                  css={override}
                  //   height={150}
                  color={"#00a200"}
                  loading={loading}
                  // style={align}
                />
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                >
                  Sign In
                </Button>
              )}

              {/* <Grid container>
                <Grid item>
                  <Link
                    onClick={props.toggle}
                    className={classes.pointer}
                    variant="body2"
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
            </ValidatorForm>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
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

export default Login;
