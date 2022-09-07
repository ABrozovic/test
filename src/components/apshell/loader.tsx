import { Box, Center, Loader } from "@mantine/core";

function AppShellLoader() {
  return (
    <Box
      sx={() => ({
        display: "flex",
        height:"calc(100% - 50px)",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
      })}
    >
      <Center>
        <Loader size={"lg"} />
      </Center>
    </Box>
  );
}
export default AppShellLoader;
