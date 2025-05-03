"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type ActiveUser = {
  sessionId: string;
  userName: string;
  coinName: string;
};

type ActiveUserContextType = {
  activeUser: ActiveUser | null;
  setActiveUser: (user: ActiveUser | null) => void;
};

const ActiveUserContext = createContext<ActiveUserContextType | undefined>(undefined);

export function ActiveUserProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser() {
  const context = useContext(ActiveUserContext);
  if (!context) throw new Error("useActiveUser must be used within ActiveUserProvider");
  return context;
} 