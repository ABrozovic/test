import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { customUserAuthSchema, RegisterUserInput } from "../schema/user.schema";

import { Button, Card, Center, Group, Stack, Text, Title } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { onPromise } from "../utils/promise-wrapper";
import FormInput from "../components/formInput";

function SignInPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(customUserAuthSchema),
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const goToRegisterPage = async () => {
    await router.push("/register");
  };

  async function onSubmit(values: RegisterUserInput) {
    const token = await signIn("credentials", {
      callbackUrl: "http://localhost:3000/api/restricted",
      redirect: false,
      username: values.username,
      password: values.password,
    });
    if (token?.error) {
      setError("Invalid username or password");
    } else {
      await router.push("/");
    }
  }

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder>
      <Center>
        <Title size={"sm"} pb={8}>
          User Login
        </Title>
      </Center>

      <form onSubmit={onPromise(handleSubmit(onSubmit))}>
        <Stack mb={16} spacing="xs">
          <FormInput
            type={"text"}
            label="Username:"
            placeholder="Enter your username"
            errors={errors.username}
            register={register("username")}
          />

          <FormInput
            label="Password:"
            type={"password"}
            placeholder={"Enter your password"}
            register={register("password")}
            errors={errors.password}
          />
        </Stack>
        <Group grow pb={12}>
          <Button type="submit">Sign In</Button>
          <Button variant="outline">Cancel</Button>
        </Group>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Center pb={8}>
          <a
            onClick={onPromise(goToRegisterPage)}
            className="cursor-pointer hover:underline text-slate-400"
          >
            <Text color="dimmed" size={"sm"}>
              {"Don't have an account?"}
            </Text>
          </a>
        </Center>
      </form>
    </Card>
  );
}

export default SignInPage;
