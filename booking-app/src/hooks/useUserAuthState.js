import { useReducer, useEffect, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";

function authReducer(state, action) {
  switch (action.type) {
    case "error":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "user":
      return {
        ...state,
        user: action.user,
        loading: false,
        error: null,
      };
    default:
      throw new Error("Unknown action type in authReducer");
  }
}

export default function useUserAuthState(auth) {
  const [{ user, error, loading }, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const listener = onAuthStateChanged(
      auth,
      (user) => dispatch({ type: "user", user }),
      (error) => dispatch({ type: "error", error })
    );

    return () => {
      listener();
    };
  }, [auth]);

  return useMemo(() => [user, loading, error], [user, loading, error]);
}
