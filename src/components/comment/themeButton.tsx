import { Button, ButtonProps, useMantineTheme } from "@mantine/core";
import { getThemeColor } from "../../utils/themeBuilder";

interface ButtonPropsWithChildren extends ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}
function ThemeButton(buttonProps: ButtonPropsWithChildren) {
  const theme = useMantineTheme();
  
  return (
    <Button {...buttonProps} color={getThemeColor(theme.colorScheme)}>
      {buttonProps.children}
    </Button>
  );
}
export default ThemeButton;
