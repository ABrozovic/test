import { MantineThemeOverride } from "@mantine/core";


interface ColorSchemeContextProps {
    styleScheme: MantineThemeOverride;
    toggleColorScheme(): void;
}
export declare function useMantineColorScheme(): ColorSchemeContextProps;
interface ColorSchemeProviderProps extends ColorSchemeContextProps {
    children: React.ReactNode;
}
export declare function CustomStyleProvider({ styleScheme, toggleColorScheme, children, }: ColorSchemeProviderProps): JSX.Element;

export {};