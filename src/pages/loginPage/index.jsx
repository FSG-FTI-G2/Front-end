import * as style from "./styles.js";
import imageBanner from "../../assets/images/loginImage.jpg";
import { Button, Flex, PasswordInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { login } from "../../apis/auth.js";
import useGlobalStore from "../../context/global.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

export default function LoginLayout() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const navigator = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Flex style={style.wrapperStyle}>
      <Flex style={style.containerStyle}>
        <Flex direction="column" style={style.formStyle} gap={20}>
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
            />
            <PasswordInput
              withAsterisk
              label="Enter your password"
              placeholder="Password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={isButtonLoading}>
              Login
            </Button>
          </form>
        </Flex>
      </Flex>
      <Flex style={style.containerStyle}>
        <img src={imageBanner} alt="login" style={style.imageStyle} />
      </Flex>
    </Flex>
  );
}
