import {
  Avatar,
  Box,
  Center,
  createStyles,
  Divider,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { getThemeColor } from "../../utils/themeBuilder";

function AppShellSidebar() {
  const { data: session } = useSession();
  const { classes } = useStyles();

  return (
    <Box
      sx={() => ({
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
      })}
    >
      {session?.user?.id ? (
        <>
          <Box
            sx={() => ({
              display: "flex",
              flexDirection: "column",
            })}
          >
            <Center>
              <Avatar size={"md"} radius="xl" color={"red"} />
            </Center>
            <Text align="center">Usernamea sdfsdafdas</Text>
            <Divider mt={"xs"} variant="dashed" />
            <Box
              sx={() => ({
                display: "flex",
                flexDirection: "column",
                marginTop: "0.5rem",
              })}
            >
              <UnstyledButton className={classes.button}>HOME</UnstyledButton>
              <UnstyledButton className={classes.button}>BOOKS</UnstyledButton>
              <UnstyledButton className={classes.button}>
                BUDDYREAD
              </UnstyledButton>
            </Box>
          </Box>

          <UnstyledButton className={classes.button}>LOGOUT</UnstyledButton>
        </>
      ) : (
        <Box
          sx={() => ({
            display: "flex",
            flexDirection: "column",
          })}
        >
          <Text
            align="center"
            size={"xl"}
            weight={"bolder"}
            mt={-2}
            className={classes.text}
            pb="xs"
          >
            Leggings4Life
          </Text>
          <Divider mb={"xs"} variant="dashed" />
          <UnstyledButton className={classes.button}>Register</UnstyledButton>
          <UnstyledButton className={classes.button}>Sign In</UnstyledButton>
        </Box>
      )}
    </Box>
  );
}
export default AppShellSidebar;

const useStyles = createStyles((theme) => ({
  button: {
    color: getThemeColor(theme.colorScheme),
    padding: `5px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.md,
    textAlign: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    marginBottom: `0.3rem`,
    fontWeight: 700,
    [`&:hover`]: {
      textDecoration: "underline",
    },
  },
  text: {
    color: getThemeColor(theme.colorScheme),
  },
}));
