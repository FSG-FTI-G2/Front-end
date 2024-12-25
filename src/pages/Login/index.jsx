import * as style from "./styles.js";
import imageBanner from "../../assets/images/loginImage.jpg";
import appLogo from "../../assets/images/appLogo.png";
import {
  Anchor,
  Button,
  Flex,
  Group,
  Image,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { login } from "../../apis/auth.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import useGlobalStore from "../../context/global.js";

export default function LoginLayout() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const reset = useGlobalStore((state) => state.reset);
  const navigator = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    document.title = "Login";
    reset();
  }, []);

  return (
    <Flex style={style.wrapperStyle}>
      <Flex style={style.containerStyle}>
        <Flex direction="column" style={style.formStyle} gap={20}>
          <Image
            src={appLogo}
            alt="logo"
            style={{
              userSelect: "none",
              width: 150,
              objectFit: "contain",
            }}
            draggable={false}
          />
          <Flex direction="column">
            <Title order={2}>Welcome</Title>
            AI powered your document
          </Flex>
          <form
            onSubmit={form.onSubmit((values) => {
              setIsButtonLoading(true);
              login({
                username: values.username,
                password: values.password,
                onSuccess: () => {
                  setIsButtonLoading(false);
                  navigator("/dashboard");
                },
                onFail: (message) => {
                  setIsButtonLoading(false);
                  notifications.show({
                    title: "Login Failed",
                    message: message,
                    color: "red",
                  });
                },
              });
            })}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <TextInput
              withAsterisk
              label="Enter your username"
              placeholder="Username"
              key={form.key("username")}
              {...form.getInputProps("username")}
              radius="md"
            />
            <PasswordInput
              withAsterisk
              label="Enter your password"
              placeholder="Password"
              key={form.key("password")}
              {...form.getInputProps("password")}
              radius="md"
            />
            <Flex justify="space-between">
              <Anchor size="sm">Forgot password</Anchor>
              <Group gap="xs">
                <Text size="sm">Don't have an account?</Text>
                <Anchor size="sm">Register</Anchor>
              </Group>
            </Flex>
            <Button type="submit" loading={isButtonLoading} radius="md">
              Login
            </Button>
          </form>
        </Flex>
      </Flex>
      <Flex style={style.containerStyle}>
        <img
          src={imageBanner}
          alt="login"
          style={style.imageStyle}
          draggable={false}
        />
      </Flex>
    </Flex>
  );
}
