import { MantineThemeOverride } from "@mantine/core";
import React, { createContext, useContext } from "react";
import getTheme from "./themeBuilder";

interface StyleSchemeContextProps {
  styleScheme: MantineThemeOverride;
  toggleColorScheme:()=> void;
}

const ColorSchemeContext = createContext<StyleSchemeContextProps>({
  styleScheme: getTheme("dark"),
  toggleColorScheme: () => {
    console.log("no provider");
  },
});

export function useStyleScheme() {
  const ctx = useContext(ColorSchemeContext);

  if (!ctx) {
    throw new Error(
      "useStyleScheme hook was called outside of context, make sure your app is wrapped with StyleSchemeProvider component"
    );
  }

  return ctx;
}

interface StyleSchemeProviderProps extends StyleSchemeContextProps {
  children: React.ReactNode;
}

export function StyleSchemeProvider({
  styleScheme,
  toggleColorScheme,
  children,
}: StyleSchemeProviderProps) {
  return (
    <ColorSchemeContext.Provider value={{ styleScheme, toggleColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
