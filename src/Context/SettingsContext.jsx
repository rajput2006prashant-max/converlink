
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";

const SettingsContext = createContext(null);

// Default Settings
const DEFAULT_SETTINGS = {
  general: {
    companyName: "Converlink Engineering Pvt. Ltd.",
    websiteName: "CONVERLINK",
    email: "",
    phone: "",
    address: ""
  },

  notifications: {
    emailNotification: true,
    enquiryNotification: true,
    orderNotification: true,
    quotationNotification: true,
    invoiceNotification: true,
    projectNotification: true
  },

  preferences: {
    theme: "light",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    itemsPerPage: "10"
  },

  security: {
    twoFactor: false,
    loginAlert: true
  }
};

// Nested Settings Merge
const mergeSettings = (base, incoming = {}) => ({
  ...base,
  ...incoming,

  general: {
    ...base.general,
    ...incoming.general
  },

  notifications: {
    ...base.notifications,
    ...incoming.notifications
  },

  preferences: {
    ...base.preferences,
    ...incoming.preferences
  },

  security: {
    ...base.security,
    ...incoming.security
  }
});

export function SettingsProvider({ children }) {

  // Default Settings
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Apply Theme and Language Globally
  useEffect(() => {

    document.documentElement.setAttribute(
      "data-theme",
      settings.preferences.theme
    );

    document.documentElement.setAttribute(
      "data-language",
      settings.preferences.language
    );

  }, [settings]);

  // Update Global Settings
  // No localStorage saving
  const updateGlobalSettings = useCallback((newSettings) => {

    setSettings((previousSettings) => {

      return mergeSettings(
        previousSettings,
        newSettings
      );

    });

  }, []);

  // Reset Global Settings
  const resetGlobalSettings = useCallback(() => {

    setSettings(DEFAULT_SETTINGS);

  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateGlobalSettings,
        resetGlobalSettings,

        theme: settings.preferences.theme,
        language: settings.preferences.language,

        dateFormat: settings.preferences.dateFormat,

        itemsPerPage: Number(
          settings.preferences.itemsPerPage
        )
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Custom Hook
export function useGlobalSettings() {

  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useGlobalSettings must be used inside SettingsProvider"
    );
  }

  return context;
}
