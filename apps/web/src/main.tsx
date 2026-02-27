import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router";
import { UserProvider } from "./contexts";
import { Toaster } from "sileo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Toaster 
          position="top-right" 
          offset={{ top: 60, right: 16, left: 16 }}
        />
        <Router />
        <ReactQueryDevtools/>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
