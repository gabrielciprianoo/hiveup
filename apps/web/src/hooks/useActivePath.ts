import { useLocation } from "react-router-dom";

export function useActivePath() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return { isActive, pathname: location.pathname };
}
