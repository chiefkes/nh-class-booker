import React from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
// @ts-ignore
import logo from "./../bp_logo_inverse.svg";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

const NavBar = ({ user }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    signOut(auth);
    setAnchorEl(null);
  };

  const handleExit = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar
          elevation={0}
          position="static"
          className={classes.menubackgroud}
        >
          <div className={classes.menuContainer}>
            <Toolbar>
              <img
                src={logo}
                className={classes.logo}
                alt="Logo"
                onClick={() => window.location.reload()}
                style={{ cursor: "pointer" }}
              />
              {user && (
                <div className={classes.loginDiv}>
                  <span className={classes.userName} onClick={handleMenu}>
                    Hi {user.displayName}
                  </span>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    style={{ color: "#388232", padding: "3px" }}
                  >
                    <PersonIcon className={classes.personIcon} />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={open}
                    onClose={handleExit}
                    getContentAnchorEl={null}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </div>
        </AppBar>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    margin: "auto",
  },
  personIcon: {
    [theme.breakpoints.down("xs")]: {
      width: "17px",
    },
    // @ts-ignore
    [theme.breakpoints.up("sm")]: {
      width: "19px",
    },
    // height: "px",
  },
  menuContainer: {
    flexGrow: 1,
    width: "98%",
    maxWidth: "1150px",
    display: "block",
    margin: "auto",
    paddingTop: "7px",
    paddingBottom: "7px",
  },
  menubackgroud: {
    background: "#00A200",
    width: "100%",
  },
  userName: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "13px",
      fontWeight: 400,
    },
    // @ts-ignore
    [theme.breakpoints.up("sm")]: {
      fontSize: "14px",
      fontWeight: 500,
    },
    fontFamily: "Avenir Roman, sans-serif",
    fontSize: "14px",
    color: "#00A200",
    textAlign: "center",
    margin: "auto",
    padding: "0px",
    paddingRight: "1px",
    cursor: "pointer",
  },
  logo: {
    [theme.breakpoints.down("xs")]: {
      width: "120px",
    },
    // @ts-ignore
    [theme.breakpoints.up("sm")]: {
      width: "160px",
    },
    position: "absolute",
    left: "20px",
    // width: "160px",
  },
  loginDiv: {
    position: "absolute",
    right: "20px",
    backgroundColor: "rgb(255, 255, 255)",
    paddingBottom: "0px",
    paddingLeft: "17px",
    paddingRight: "13px",
    paddingTop: "2px",
    borderRadius: "21px",
  },
}));

export default NavBar;
