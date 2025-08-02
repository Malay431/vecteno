'use client';

import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "./context/AppContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </SessionProvider>
  );
}
