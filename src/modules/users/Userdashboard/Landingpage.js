
import React, { useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";

import Headerpage from "../../shares/Headerpage";
import Sidebar from "../../shares/Sidebar";
import Footerpage from "../../shares/Footerpage";
import { useGlobalSettings } from "../../../Context/SettingsContext";

const API = "http://localhost:8700/usersettings";

function Landingpage() {
  const { theme, updateGlobalSettings } = useGlobalSettings();

  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        const loginData = localStorage.getItem("userLoginData");

        if (!loginData) return;

        const user = JSON.parse(loginData);

        if (!user.id) return;

        const response = await axios.get(
          `${API}?userId=${encodeURIComponent(user.id)}`
        );

        if (response.data.length > 0) {
          const savedSettings = response.data[0];

          const savedPreferences = {
            theme: savedSettings.preferences?.theme || "light",
            language: savedSettings.preferences?.language || "English",
            dateFormat:
              savedSettings.preferences?.dateFormat || "DD/MM/YYYY",
            itemsPerPage:
              savedSettings.preferences?.itemsPerPage || "10"
          };

          // JSON Server se theme aur preferences Context mein update
          updateGlobalSettings({
            preferences: savedPreferences
          });
        }
      } catch (error) {
        console.error("Theme loading error:", error);
      }
    };

    loadUserTheme();
  }, [updateGlobalSettings]);

  return (
    <div
      className={`user-dashboard-theme ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <Headerpage />

      <div className="container-fluid">
        <div className="row">

          {/* Sidebar */}
          <div className="col-2 m-0 p-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-10 ch">
            <Outlet />
            <Footerpage />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Landingpage;
