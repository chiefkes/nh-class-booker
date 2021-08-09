import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Login from "./authentication/Login";
import BookingPage from "./components/BookingPage";
import React from "react";

function App() {
  const [user, setUser] = useState(null);
  const userState = () => {
    const data = localStorage.getItem("user");
    const us = data !== null ? JSON.parse(data) : null;
    setUser(us);
  };

  useEffect(() => {
    userState();
  }, []);

  return (
    <>
      {user !== null ? (
        <>
          <NavBar user={user} setUserState={() => setUser(null)} />
          <BookingPage user={user} />
        </>
      ) : (
        <>
          <NavBar user={user} />
          <Login loggedIn={(user) => setUser(user)} />
        </>
      )}
    </>
  );
}

export default App;
