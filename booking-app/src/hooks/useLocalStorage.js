import { useState } from "react";

export default function useLocalStorage(initialValue = null) {
  const [user, setUser] = useState(() => {
    try {
      const data = window.localStorage.getItem("user");
      return data ? JSON.parse(data) : initialValue;
    } catch (err) {
      console.log(err);
      return initialValue;
    }
  });

  const setStorage = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(user) : value;
      setUser(valueToStore);
      window.localStorage.setItem("user", JSON.stringify(valueToStore));
    } catch (err) {
      console.warn(err);
    }
  };
  return [user, setStorage];
}
