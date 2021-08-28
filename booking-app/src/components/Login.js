import React, { useState } from "react";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  FormControlLabel,
  Button,
  Checkbox,
  Card,
  CardContent,
} from "@material-ui/core";
import { LockRounded } from "@material-ui/icons";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { BeatLoader } from "react-spinners";
import { useStyles } from "../style/LoginStyles";

const Login = () => {
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

  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => setLoading(false))
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
              onSubmit={handleLogin}
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
                onChange={(event) => setEmail(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
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
                    onChange={(event) => setRememberMe(event.target.checked)}
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

export default Login;
