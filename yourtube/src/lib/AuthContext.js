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
import { getThemeByLocation } from "./theme";
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

  const getUserState = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve("");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          resolve(data.address.state || "");
        } catch (error) {
          console.error(error);
          resolve("");
        }
      },
      () => {
        resolve("");
      }
    );
  });
};


  // Google Sign In
  const handlegooglesignin = async () => {
  try {
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

    console.log("Payload:", payload);

    // Send OTP
    const response = await axiosInstance.post(
      "/user/login",
      payload
    );

    console.log(response.data);

    if (response.data.success) {
      const otp = prompt(
        `Enter OTP sent to your ${
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
          }
        );

      if (verifyResponse.data.success) {
        const userdata =
          verifyResponse.data.result;

        const theme = getThemeByLocation(
          userdata.state
        );

        console.log("State:", userdata.state);
        console.log("Theme:", theme);

        localStorage.setItem(
          "theme",
          theme
        );

        document.documentElement.classList.remove(
          "light",
          "dark"
        );

        document.documentElement.classList.add(
          theme
        );

        login(userdata);

        alert("Login Successful");
      } else {
        alert("Invalid OTP");
      }
    }
  } catch (error) {
    console.error(
      "Google Login Error:",
      error.response?.data || error
    );
  }
};

  // Firebase auth listener
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseuser) => {
    if (!firebaseuser) {
      setUser(null);
    }
  });

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