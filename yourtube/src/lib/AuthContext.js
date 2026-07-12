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
import { getThemeByLocation } from "./theme";
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
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, []);

  // Login
  const login = (userdata) => {
    setUser(userdata);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userdata));
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);

      localStorage.removeItem("user");
    } catch (err) {
      console.error(err);
    }
  };

  // Get user state
  const getUserState = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve("");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
            );

            const data = await response.json();

            resolve(data.address.state || "");
          } catch (err) {
            console.error(err);
            resolve("");
          }
        },
        () => resolve("")
      );
    });
  };

  // Google Login
  const handlegooglesignin = async () => {
    try {
      console.log(
        "API URL:",
        process.env.NEXT_PUBLIC_API_URL
      );

      const result = await signInWithPopup(auth, provider);

      const firebaseuser = result.user;

      const state = await getUserState();

      const payload = {
        email: firebaseuser.email,
        name: firebaseuser.displayName,
        image:
          firebaseuser.photoURL ||
          "https://github.com/shadcn.png",
        state,
        phone: "",
      };

      console.log("Sending Payload:", payload);

      const response = await axiosInstance.post(
        "/user/login",
        payload,
        {
          timeout: 30000,
        }
      );

      console.log("Backend Response:", response.data);

      if (!response.data.success) {
        alert(response.data.message);
        return;
      }

      const otp = prompt(
        `Enter OTP sent to ${
          state === "Tamil Nadu"
            ? "Email"
            : "Mobile"
        }`
      );

      if (!otp) return;

      const verifyResponse =
        await axiosInstance.post(
          "/user/verify-otp",
          {
            userId: response.data.userId,
            otp,
          },
          {
            timeout: 30000,
          }
        );

      console.log(
        "Verify Response:",
        verifyResponse.data
      );

      if (!verifyResponse.data.success) {
        alert("Invalid OTP");
        return;
      }

      const userdata = verifyResponse.data.result;

      const theme = getThemeByLocation(
        userdata.state
      );

      localStorage.setItem("theme", theme);

      document.documentElement.classList.remove(
        "light",
        "dark"
      );

      document.documentElement.classList.add(
        theme
      );

      login(userdata);

      alert("Login Successful");
    } catch (error) {
      if (error.response) {
        console.error(
          "Response Error:",
          error.response.data
        );
      } else if (error.request) {
        console.error(
          "No Response:",
          error.request
        );
      } else {
        console.error(error.message);
      }

      console.error(error);

      alert(
        "Unable to connect to the server. Check Render and API URL."
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseuser) => {
        if (!firebaseuser) {
          setUser(null);
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

export const Useuser = () => useContext(UserContext);

export default UserContext;