import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import BookingPage from "./components/BookingPage";
import useUserAuthState from "./hooks/useUserAuthState";
import { auth } from "./services/firebase";

function App() {
  const [user, loading, error] = useUserAuthState(auth);

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
