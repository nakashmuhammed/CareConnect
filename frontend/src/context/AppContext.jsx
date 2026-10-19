import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);

  // Fetch all doctors from the backend
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch logged-in user profile data
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success || data.sucess) {
        let user = data.userData;
        if (user && typeof user.address === "string") {
          try {
            user.address = JSON.parse(user.address);
          } catch {
            user.address = { line1: user.address, line2: "" };
          }
        }
        setUserData(user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Load doctors list on initial mount
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Sync token changes with LocalStorage and fetch user profile
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadUserProfileData();
    } else {
      localStorage.removeItem("token");
      setUserData(false);
    }
  }, [token]);

  // Context value bundle
  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;