//import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Center, Group, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { customUserAuthSchema, RegisterUserInput } from "../schema/user.schema";
import { onPromise } from "../utils/promise-wrapper";
import { trpc } from "../utils/trpc";
import FormInput from "./book/upload/components/formInput";

function RegisterPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(customUserAuthSchema),
  });
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => {
      //router.push("/login");
    },
    onError: (err) => {
      return console.log(err);
    },
  });
  const goToLoginPage = async () => {
    await router.push("/signin");
  };
  function onSubmit(values: RegisterUserInput) {
    mutate(values);
  }

  return (
    <Card shadow="sm" p="sm" radius="md" withBorder>
      <Center>
        <Title size={"sm"} pb={8}>
          User Registration
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
          <Button type="submit">Register</Button>
          <Button variant="outline">Cancel</Button>
        </Group>

        {error && (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        )}
        <Center pb={8}>
          <a
            onClick={onPromise(goToLoginPage)}
            className="cursor-pointer hover:underline text-slate-400"
          >
            <Text color="dimmed" size={"sm"}>
              Already have an account?
            </Text>
          </a>
        </Center>
      </form>
    </Card>
  );
}

export default RegisterPage;
