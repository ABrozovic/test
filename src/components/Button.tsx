import { Button as MButton, useMantineTheme } from "@mantine/core";
export default function Button(){
  const theme = useMantineTheme();
  return (
    <MButton color={theme.colorScheme === "light" ? "brand.5" : "dark.3"}>
      {" "}
    </MButton>
  );
}
