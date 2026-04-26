"use client";

import { SessionProvider } from "next-auth/react";
import { KeranjangProvider } from "@/context/KeranjangContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <KeranjangProvider>{children}</KeranjangProvider>
    </SessionProvider>
  );
}
