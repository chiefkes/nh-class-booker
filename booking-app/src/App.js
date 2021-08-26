import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Login from "./authentication/Login";
import BookingPage from "./components/BookingPage";
import useUserAuthState from "./hooks/useUserAuthState";
import firebase from "./services/firebase";

function App() {
  const [user, loading, error] = useUserAuthState(firebase.auth());

  if (error) return <p>{error}</p>;
  if (loading) return <NavBar user={user} />;

  return (
    <>
      <NavBar user={user} />
      {user !== null ? <BookingPage user={user} /> : <Login />}
    </>
  );
}

export default App;
