import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      error: "",

      login: (username, password, users) => {
        const user = users.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          set({ user, isLoggedIn: true, error: "" });
        } else {
          set({
            error: "اسم المستخدم أو كلمة المرور غير صحيحة",
            user: null,
            isLoggedIn: false,
          });
        }
      },

      logout: () => {
        set({ user: null, isLoggedIn: false, error: "" });
        localStorage.removeItem("auth-storage"); // Clear persisted data
      },
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
