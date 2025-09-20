"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PatientContact = {
  email: string;
  phone: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  contact: PatientContact[];
  status: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  patient: Patient[];
};

type UserContextType = {
  user: UserProfile | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
});

export function UserProvider({
  children,
  serverProfile,
}: {
  children: ReactNode;
  serverProfile: UserProfile | null;
}) {
  const [user] = useState<UserProfile | null>(serverProfile);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
