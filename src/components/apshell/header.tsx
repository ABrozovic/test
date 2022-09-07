import {
  Burger,
  Button,
  Drawer,
  Header,
  MediaQuery,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useStyleScheme } from "../../utils/styleProvider";
import { getThemeColor } from "../../utils/themeBuilder";
import AppShellSidebar from "./sidebar";
function AppshellHeader() {
  const [showSidebar, setShowSidebar] = useState(false);
  //   const [showDrawer, setShowDrawer] = useState(false);
  const { styleScheme, toggleColorScheme } = useStyleScheme();
  return (
    <>
      <Drawer
        opened={showSidebar}
        onClose={() => setShowSidebar(false)}
        withCloseButton={false}
        padding="xs"
        size="sm"
      >
        <AppShellSidebar />
      </Drawer>
      <Header height={50} p="xs">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                color={getThemeColor(styleScheme.colorScheme ?? "light")}
                opened={showSidebar}
                onClick={() => setShowSidebar((o) => !o)}
                size="md"
                mr="xl"
              />
            </MediaQuery>
            <Text
              size={"xl"}
              weight={"bolder"}
              color={getThemeColor(styleScheme.colorScheme ?? "light")}
            >
              Leggings4Life
            </Text>
          </div>
          <Button
            onClick={toggleColorScheme}
            color={"transparent"}
            variant="outline"
            size="xs"
            px={"xs"}
          >
            {styleScheme.colorScheme === "light" ? (
              <FaMoon size={20} />
            ) : (
              <FaSun size={20} />
            )}
          </Button>
        </div>
      </Header>
    </>
  );
}
export default AppshellHeader;
