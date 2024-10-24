import { Flex, Input, Loader, Text } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

/**
 * @param {{
 * loading: boolean
 * onMessage: (message: string) => void
 * leftSection?: JSX.Element
 * rightSection?: JSX.Element
 * }} props
 * @returns {JSX.Element}
 */
export default function ChatInput({
  loading,
  onMessage,
  leftSection,
  rightSection,
}) {
  const [message, setMessage] = useState("");

  return (
    <Flex p="md" direction="column" align="center" gap="sm">
      <Flex justify="center" align="center" gap="sm" w="100%">
        {leftSection}
        <Input
          placeholder="Enter message here"
          variant="filled"
          radius="xl"
          size="md"
          rightSection={loading ? <Loader size="sm" /> : <IoSend />}
          w="100%"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          onKeyDown={getHotkeyHandler([
            [
              "Enter",
              () => {
                onMessage(message);
                setMessage("");
              },
            ],
          ])}
          disabled={loading}
        />
        {rightSection}
      </Flex>
      <Text align="center" c="gray" size="sm">
        AI may response incorrectly, please double check.
      </Text>
    </Flex>
  );
}
