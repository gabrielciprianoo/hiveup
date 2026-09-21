import { useState, useCallback, useMemo, type ReactNode } from "react";
import { UserContext, type User, type UserContextValue } from "./user-context";

const DEFAULT_USER: User = {
  id: "1",
  name: "Gabriel",
  email: "gabriel@hiveup.com",
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  const login = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  );

  return (
    <UserContext value={value}>
      {children}
    </UserContext>
  );
}
