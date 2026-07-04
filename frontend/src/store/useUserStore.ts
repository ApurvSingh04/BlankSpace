import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    name: string | null;
    id: string | null;
    email: string | null;
    setName: (name: string | null) => void;
    setId: (id: string | null) => void;
    setEmail: (email: string | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: null,
            id: null,
            email: null,
            setName: (name) => set({ name }),
            setId: (id) => set({ id }),
            setEmail: (email) => set({ email }),
            logout: () => {
                set({ name: null, id: null, email: null });
                localStorage.removeItem("token");
                window.location.href = "/signin";
            }
        }),
        {
            name: 'user-storage', // key in localStorage
        }
    )
);
