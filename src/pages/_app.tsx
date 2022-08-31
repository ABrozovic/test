// src/pages/_app.tsx
import {
  AppShell,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  Header,
  MantineProvider,
  MantineThemeOverride,
  MediaQuery,
  Navbar,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { withTRPC } from "@trpc/next";
import { getCookie, setCookie } from "cookies-next";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import superjson from "superjson";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import getTheme from "../utils/themeBuilder";

const mantineCache = createEmotionCache({ key: "mantine" });
const MyApp: AppType = ({
  Component,
  pageProps: { session, themeColorScheme, ...pageProps },
}) => {
  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(themeColorScheme);
  const [styleTheme, setStyleTheme] = useState<MantineThemeOverride>(
    getTheme(themeColorScheme)
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setStyleTheme(getTheme(nextColorScheme));
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };


  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        emotionCache={mantineCache}
        withGlobalStyles
        withNormalizeCSS
        theme={styleTheme}
      >
        <NotificationsProvider>
          <SessionProvider session={session}>
            <AppShell
              header={
                <Header height={50} p="xs">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                      <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        // color={theme.colors.gray[6]}
                        mr="xl"
                      />
                    </MediaQuery>
                    <Text weight={"bolder"}>Leggings4Life</Text>
                    <NavBar />
                  </div>
                </Header>
              }
              aside={
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                  <Navbar
                    p="md"
                    hiddenBreakpoint="sm"
                    width={{ sm: 200, lg: 300 }}
                  >
                    <Text>Nav bar</Text>
                  </Navbar>
                </MediaQuery>
              }
              padding="xs"
            >
              <Component {...pageProps} />
            </AppShell>
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
MyApp.getInitialProps = ({ ctx }) => ({
  pageProps: {
    themeColorScheme: getCookie("mantine-color-scheme", ctx) || "light",
  },
});

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
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

function NavBar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <div
      onClick={() => toggleColorScheme()}

      // sx={(theme) => ({
      //   backgroundColor:
      //     theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      //   color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
      // })}
    >
      <FaBook />
    </div>
  );
}
