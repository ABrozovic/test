// src/pages/_app.tsx
import {
  AppShell,
  Button,
  MantineProvider,
  MantineThemeOverride,
  MediaQuery,
  Navbar,
} from "@mantine/core";
import { withTRPC } from "@trpc/next";
import { getCookie, setCookie } from "cookies-next";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { useState } from "react";
import superjson from "superjson";
import AppshellHeader from "../components/apshell/header";
import AppShellSidebar from "../components/apshell/sidebar";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import { StyleSchemeProvider, useStyleScheme } from "../utils/styleProvider";
import getTheme from "../utils/themeBuilder";

const MyApp: AppType = ({
  Component,
  pageProps: { session, themeColorScheme, ...pageProps },
}) => {
  const [opened, setOpened] = useState(false);
  const [styleTheme, setStyleTheme] = useState<MantineThemeOverride>(
    getTheme(themeColorScheme)
  );
  const toggleColorScheme = () => {
    const nextColorScheme =
      styleTheme.colorScheme === "dark" ? "light" : "dark";
    setStyleTheme(getTheme(nextColorScheme));
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <SessionProvider session={session}>
      <StyleSchemeProvider
        styleScheme={styleTheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS theme={styleTheme}>
          <AppShell
            header={<AppshellHeader />}
            aside={
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Navbar
                  p="md"
                  hiddenBreakpoint="sm"
                  width={{ sm: 200, lg: 300 }}
                >
                  <AppShellSidebar />
                </Navbar>
              </MediaQuery>
            }
            padding="xs"
          >
            <Component {...pageProps} />
          </AppShell>
        </MantineProvider>
      </StyleSchemeProvider>
    </SessionProvider>
  );
};
MyApp.getInitialProps = ({ ctx }) => ({
  pageProps: {
    themeColorScheme: getCookie("mantine-color-scheme", ctx) || "light",
  },
});

function NavBar() {
  const { toggleColorScheme } = useStyleScheme();
  return (
    <div

    // sx={(theme) => ({
    //   backgroundColor:
    //     theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    //   color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
    // })}
    >
      <Button onClick={() => toggleColorScheme()}>test</Button>
    </div>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
