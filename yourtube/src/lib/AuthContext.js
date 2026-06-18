"use client";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth, provider } from "./firebase";
import axiosInstance from "./axiosinstance";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, []);

  // Save user
  const login = (userdata) => {
    setUser(userdata);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "user",
        JSON.stringify(userdata)
      );
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Google Sign In
  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );

      const firebaseuser = result.user;

      const payload = {
        email: firebaseuser.email,
        name: firebaseuser.displayName,
        image:
          firebaseuser.photoURL ||
          "https://github.com/shadcn.png",
      };

      const response = await axiosInstance.post(
        "/user/login",
        payload
      );

      const userdata =
        response.data.result ||
        response.data.user ||
        response.data;

      login(userdata);
    } catch (error) {
      console.error(
        "Google Login Error:",
        error.code,
        error.message
      );
    }
  };

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseuser) => {
        if (!firebaseuser) return;

        try {
          const payload = {
            email: firebaseuser.email,
            name: firebaseuser.displayName,
            image:
              firebaseuser.photoURL ||
              "https://github.com/shadcn.png",
          };

          const response = await axiosInstance.post(
            "/user/login",
            payload
          );

          const userdata =
            response.data.result ||
            response.data.user ||
            response.data;

          login(userdata);
        } catch (error) {
          console.error(
            "Auth State Error:",
            error
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        handlegooglesignin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const Useuser = () => {
  return useContext(UserContext);
};

export default UserContext;