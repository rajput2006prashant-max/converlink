import { Fragment, useEffect } from "react";
import axios from "axios";

import Headerpage from "../../AdminShare/Headerpage";
import Sidebarpage from "../../AdminShare/Sidebarpage";
import Footerpage from "../../AdminShare/Footerpage";
import { Outlet } from "react-router-dom";
import { useGlobalSettings } from "../../../Context/SettingsContext";

function AdminLandingpage() {
  const { theme, updateGlobalSettings } = useGlobalSettings();

  // Refresh hone par saved theme load karo
  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        const loginData = JSON.parse(
          localStorage.getItem("adminLoginData") || "null"
        );

        if (!loginData?.email) return;

        // Admin find karo
        const adminResponse = await axios.get(
          "http://localhost:8700/admin"
        );

        const admin = adminResponse.data.find(
          (item) => item.email === loginData.email
        );

        if (!admin) return;

        // JSON Server se settings load karo
        const settingsResponse = await axios.get(
          "http://localhost:8700/settings"
        );

        const savedSettings = settingsResponse.data.find(
          (item) => String(item.adminId) === String(admin.id)
        );

        if (savedSettings) {
          updateGlobalSettings({
            general: savedSettings.general,
            notifications: savedSettings.notifications,
            preferences: savedSettings.preferences,
            security: savedSettings.security
          });
        }
      } catch (error) {
        console.error("Settings Load Error:", error);
      }
    };

    loadSavedSettings();
  }, [updateGlobalSettings]);

  return (
    <Fragment>
      <div className={`admin-layout ${theme}-theme`}>
        <Headerpage />

        <div className="container-fluid">
          <div className="row">
            <div className="col-2 m-0 p-0">
              <Sidebarpage />
            </div>

            <div className="col-10 ch admin-main-content">
              <Outlet />
              <Footerpage />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminLandingpage;