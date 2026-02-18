import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue | null>(null);
