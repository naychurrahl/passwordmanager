import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SQLiteProvider } from "expo-sqlite";

export interface ProfileProp {
  id?: string;
  service?: string;
  user?: string;
  password?: string;
  passwordVisibility?: boolean;
  action?: "create" | "update" | "reset" | "delete";
  text?: string;
}

export interface ModalProps {
  chatId: string;
  user: string;
}

export interface ColorScheme {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  decent: string;
  text: string;
  success: string;
  danger: string;
  warning: string;
  statusBarStyles: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#aeadb4ff",
  primary: "#03004cff",
  secondary: "#eb1919ff",
  accent: "#ff000060",
  decent: "#035b2293",
  text: "#0a081bff",
  success: "#035b22ff",
  danger: "#ff0000a7",
  warning: "#a87309ff",
  statusBarStyles: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#000000ff",
  primary: "#eb1919ff",
  secondary: "#03004cff",
  accent: "#ff000060",
  decent: "#035b2293",
  text: "#998ff2ff",
  success: "#035b22ff",
  danger: "#ff0000ac",
  warning: "#a87309ff",
  statusBarStyles: "dark-content" as const,
};

interface AppContextType {
  login: (value: string) => void;
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isBiometric: boolean;
  toggleBiometric: () => void;
  colors: ColorScheme;
  auth: string | null;
  setAuth: (value: string | null) => void;
  refresh: boolean;
  toggleRefresh: () => void;
}

const AppContext = createContext<undefined | AppContextType>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isBiometric, setIsBiometric] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [auth, setAuth] = useState<string | null>(null);

  // You can also store other shared values here
  const login = async (userData: string) => {
    await AsyncStorage.setItem("user", userData);
  };

  const logout = async () => {
    await AsyncStorage.setItem("user", JSON.stringify(false));
  };
  //const login = (userData: any) => {setUser(userData)};
  //const login = (userData: any) => {Alert.alert("title", JSON.stringify(userData))};
  //const logout = () => setUser(false);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) setIsDarkMode(JSON.parse(value));
    });
  }, [isDarkMode]);

  useEffect(() => {
    AsyncStorage.getItem("biometric").then((value) => {
      if (value) setIsBiometric(JSON.parse(value));
    });
  }, [isBiometric]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    await AsyncStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const toggleBiometric = async () => {
    const newMode = !isBiometric;
    setIsBiometric(newMode);
    await AsyncStorage.setItem("biometric", JSON.stringify(newMode));
  };

  const toggleRefresh = async () => {
    const newMode = !refresh;
    setRefresh(newMode);
    await AsyncStorage.setItem("biometric", JSON.stringify(newMode));
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <AppContext.Provider
      value={{
        login,
        logout,
        isDarkMode,
        toggleDarkMode,
        isBiometric,
        toggleBiometric,
        colors,
        auth,
        setAuth,
        refresh,
        toggleRefresh,
      }}
    >
      <SQLiteProvider
        databaseName="passwordManager.db"
        onInit={async (db) => {
          await db.execAsync(`
          CREATE TABLE  IF NOT EXISTS vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service TEXT NOT NULL,
            user TEXT NOT NULL,
            password TEXT NOT NULL
          );
          PRAGMA journal_mode = WAL;
        `);
        }}
        options={{ useNewConnection: false }}
      >
        {children}
      </SQLiteProvider>
    </AppContext.Provider>
  );
};

// Custom hook to use anywhere
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("error");
  }

  return context;
};
