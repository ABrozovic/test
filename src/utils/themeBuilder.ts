import { ColorScheme, MantineThemeOverride, Tuple } from "@mantine/core";

const brand: Tuple<string, 10> = [
  "#E2E0E2",
  "#BEB7BE",
  "#AFA4AF",
  "#A292A2",
  "#988098",
  "#897389",
  "#796A79",
  "#6C616C",
  "#605860",
  "#555055",
];
const purple: Tuple<string, 10> = [
  "#F3F2F6",
  "#DBD6E6",
  "#C3B9DA",
  "#AD9CD3",
  "#977DD1",
  "#805AD5",
  "#7350C1",
  "#694CA9",
  "#624D90",
  "#5A4B7C",
];

function getPrimaryColor(theme: string) {
  return theme === "dark" ? "purple" : "brand";
}
export function getThemeColor(theme: string) {  
  return theme === "dark" ? purple[4] : brand[6];
}
export default function getTheme(theme: ColorScheme): MantineThemeOverride {
  return {
    colorScheme: theme,
    colors: {
      brand,
      purple,
    },
    primaryColor: getPrimaryColor(theme),
  };
}
