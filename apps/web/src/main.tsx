import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router";
import { UserProvider } from "./contexts";
import { Toaster } from "sileo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Toaster
          position="top-right"
          offset={{ top: 60, right: 16 }}
          options={{
            fill: "#FFFFFF",
            roundness: 12,
            styles: {
              title: "text-dark font-medium",
              description: "text-dark/70",
              badge: "bg-primary/20",
            },
          }}
        />
        <Router />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
