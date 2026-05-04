import { create } from "zustand";

const storedToken = localStorage.getItem("serums_token");
const storedUser = localStorage.getItem("serums_user");

export const useAuthStore = create((set) => ({
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: Boolean(storedToken),

  login: ({ token, usuario }) => {
    localStorage.setItem("serums_token", token);
    localStorage.setItem("serums_user", JSON.stringify(usuario));

    set({
      token,
      user: usuario,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("serums_token");
    localStorage.removeItem("serums_user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));