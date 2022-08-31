import {
  Button,
  Text,
  TypographyStylesProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import DynamicRichText from "../components/dynamicRichText";

export default function ColorSchemeToggle() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [value, onChange] = useState("");
  return (
    <div>
      <Button
        color={colorScheme === "light" ? "brand.5" : "dark.3"}
        onClick={() => toggleColorScheme()}
      >
        fff
      </Button>
      <Button
        color={colorScheme === "light" ? "brand.5" : "dark.3"}
        onClick={() => {
          console.log(colorScheme);
        }}
      >
        Hello World
      </Button>
      <DynamicRichText value={value} onChange={onChange} />;
      <TypographyStylesProvider>
        <Text>
          <div
            className=" w-full break-words"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </Text>
      </TypographyStylesProvider>
      <Text>
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456 123456 123456 123456 123456 123456 123456
        123456 123456 123456 123456{" "}
      </Text>
      {/* <DynamicRichText readOnly value={value} onChange={()=>console.log("f")}/> */}
    </div>
  );
}
