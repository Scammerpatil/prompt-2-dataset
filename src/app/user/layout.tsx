"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "@/context/UserContext";
import SideNav from "./SideNav";
import { useEffect } from "react";
import axios from "axios";

const Component = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUser();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/api/auth/verifytoken");
      if (response.data) {
        setUser(response.data.user);
      }
    };
    fetchUser();
  }, []);
  return (
    <html lang="en">
      <head>
        <title>Prompt-2-Dataset</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Prompt-2-Dataset will essentially be an AI-driven dataset generator that takes in a user’s project idea and outputs a structured dataset along with model recommendations."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Component>{children}</Component>
    </UserProvider>
  );
}
