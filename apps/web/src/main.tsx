import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router'
import { UserProvider } from './contexts'
import { Toaster } from "sileo"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
          }
        }}
      />
      <Router/>
    </UserProvider>
  </StrictMode>,
)
