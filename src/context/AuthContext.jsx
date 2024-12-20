import { createContext, useState, useContext } from "react";
import * as authService from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    setAuth({ token: response.token, user: response.user });
    return true;
  };

  const logout = () => {
    authService.logout();
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
