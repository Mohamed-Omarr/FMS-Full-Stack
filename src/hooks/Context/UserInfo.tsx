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

/**
 * Provider component for the `UserContext`.
 * @param {object} props
 * @param {ReactNode} props.children - React children nodes
 * @param {UserProfile | null} props.serverProfile - Initial server-provided user profile
 * @returns {JSX.Element} The context provider wrapping children
 */
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

/**
 * Hook to access the authenticated user from `UserContext`.
 * @returns {UserContextType} The current user context
 *
 */
export function useUser() {
  return useContext(UserContext);
}
