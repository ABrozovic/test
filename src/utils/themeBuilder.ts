import { ColorScheme, MantineThemeOverride, Tuple } from "@mantine/core";

const brand: Tuple<string, 10> = [
  "#FCF4FC",
  "#EFD4EF",
  "#DEBCDE",
  "#A88CA8",
  "#988098",
  "#906C90",
  "#875C87",
  "#804C80",
  "#7B3D7B",
  "#782D78",
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
export function getThemeBackgroundColor(theme: string) {
  return theme === "dark" ? purple[6] : brand[6];
}
export default function getTheme(theme: ColorScheme): MantineThemeOverride {
  return {
    colorScheme: theme,
    colors: {
      brand,
      purple,
    },
    loader:"bars",
    primaryColor: getPrimaryColor(theme),
  };
}
