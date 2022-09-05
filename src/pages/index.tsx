import {
  Button,
  Card,
  Center,
  clsx,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { CgSmileNone } from "react-icons/cg";
import { FaBook } from "react-icons/fa";
import { getThemeColor } from "../utils/themeBuilder";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const theme = useMantineTheme();
  const { data, isLoading } = trpc.useQuery([
    "buddyreads.get-active-buddyreads",
  ]);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Paper>
        <Group position="center">
          <LoadingOverlay visible={isLoading} overlayBlur={9} />

          {data && data?.length > 0 && !isLoading ? (
            data.map((buddyRead) => (
              <BuddyReadDisplayCard
                title={buddyRead.book.title}
                image={buddyRead.book.image ?? undefined}
                id={buddyRead.id}
                key={buddyRead.id}
              />
            ))
          ) : (
            <div style={{ height: 300, width: 250 }}>
              <Stack align={"stretch"}>
                <Stack>
                  <Text
                    transform="capitalize"
                    align="center"
                    color={"dimmed"}
                    size={"lg"}
                  >
                    No buddy reads found
                  </Text>
                  <Center>
                    <CgSmileNone
                      color={getThemeColor(theme.colorScheme)}
                      size={150}
                    />
                  </Center>
                </Stack>

                <Button mx={10}>Host one</Button>
              </Stack>
            </div>

            // <BuddyReadDisplayCard title="This is a very long title to see how it would fit int his "></BuddyReadDisplayCard>
          )}
        </Group>
      </Paper>
    </>
  );
};

// const TechnologyCard = ({
//   name,
//   description,
//   documentation,
// }: TechnologyCardProps) => {

const BuddyReadDisplayCard = ({
  image,
  title,
  id,
}: {
  image?: string;
  title: string;
  id: string;
}) => {
  const theme = useMantineTheme();
  const router = useRouter();
  return (
    <>
      <Card onClick={() => console.log(id)} withBorder>
        <Center>
          <Stack>
            {image ? (
              <Image
                objectFit={"contain"}
                src={image}
                width={200}
                height={250}
                alt="The cover of a book"
              />
            ) : (
              <div
                style={{ height: 300, width: 250 }}
                className="flex flex-col items-center justify-between cursor-pointer"
              >
                <Text align="center" weight={"bold"}>
                  {title}
                </Text>
                <>
                  <FaBook
                    className={clsx(
                      theme.colorScheme === "light" && `text-lavender text-8xl`
                    )}
                  />
                  <Text color="dimmed" lineClamp={1} size="md">
                    No cover
                  </Text>
                </>
              </div>
            )}
            <Button onClick={() => void router.push(`/buddyread/${id}`)}>Join</Button>
          </Stack>
        </Center>
      </Card>
    </>
  );
};

export default Home;
