"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

const ThemeProviderClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderClient;
