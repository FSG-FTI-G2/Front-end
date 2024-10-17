import {
  ActionIcon,
  Badge,
  Burger,
  Button,
  Card,
  Center,
  CopyButton,
  Flex,
  Input,
  Modal,
  PasswordInput,
  NavLink,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IoMdTrash } from "react-icons/io";
import {
  IoAdd,
  IoChevronDown,
  IoSend,
  IoCopyOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import Markdown from "react-markdown";
import { appColors } from "../../utils/constants";
import { Fragment, useState } from "react";

const EXAMPLE_PROMPTS = [
  "Summarize my documents",
  "What is my document topics",
  "Something in my document",
  "Can you help me with my document",
];

const LLM_MODEL_OPTIONS = [
  { label: "OpenAI", value: "openai" },
  { label: "Azure OpenAI", value: "azure-openai" },
  { label: "Gemini", value: "gemini" },
  { label: "Ollama", value: "ollama" },
];

const MOCK_OLLAMA_MODEL_VERSIONS = [
  "v1.0",
  "v1.1",
  "v1.2",
  "v1.3",
  "v1.4",
  "v1.5",
  "v1.6",
  "v1.7",
  "v1.8",
  "v1.9",
  "v1.10",
];

/**
 * @param {{
 * content: string
 * }} props
 * @returns {JSX.Element}
 */
function GetAssistantChat({ content }) {
  return (
    <Flex p="md">
      <Flex direction="column" gap="xs">
        <Markdown>{content}</Markdown>
        <Flex>
          <ActionIcon variant="subtle" radius="md" color="gray">
            <AiFillLike />
          </ActionIcon>
          <ActionIcon variant="subtle" radius="md" color="gray">
            <AiFillDislike />
          </ActionIcon>
          <CopyButton>
            {({ copied, copy }) => (
              <ActionIcon
                onClick={copy}
                color={copied ? "teal" : "gray"}
                variant="subtle"
                radius="md"
              >
                {!copied ? <IoCopyOutline /> : <IoCheckmarkOutline />}
              </ActionIcon>
            )}
          </CopyButton>
        </Flex>
      </Flex>
    </Flex>
  );
}

/**
 * @param {{
 * content: string
 * }} props
 * @returns {JSX.Element}
 */
function GetHumanChat({ content }) {
  return (
    <Flex p="md" justify="end">
      <Flex
        maw="70%"
        bg={appColors.lightGrey}
        p="md"
        style={{
          borderRadius: "16px",
        }}
      >
        <Text>{content}</Text>
      </Flex>
    </Flex>
  );
}

/**
 * @param {{
 * model: string
 * }} props
 * @returns {JSX.Element}
 */
function GetModelConfigByModel({ model }) {
  switch (model) {
    case "openai":
      return (
        <Fragment>
          <Title order={6}>OpenAI Configuation</Title>
          <TextInput
            label="Model Name"
            placeholder="Enter Model Name"
            radius="md"
          />
          <PasswordInput
            label="API Key"
            placeholder="Enter API Key"
            radius="md"
          />
        </Fragment>
      );
    case "azure-openai":
      return (
        <Fragment>
          <Title order={6}>Azure OpenAI Configuation</Title>
          <TextInput
            label="API Endpoint"
            placeholder="Enter API Endpoint"
            radius="md"
          />
          <TextInput
            label="Model Name"
            placeholder="Enter Model Name"
            radius="md"
          />
          <PasswordInput
            label="API Key"
            placeholder="Enter API Key"
            radius="md"
          />
        </Fragment>
      );
    case "gemini":
      return (
        <Fragment>
          <Title order={6}>Gemini Configuation</Title>
          <PasswordInput
            label="API Key"
            placeholder="Enter API Key"
            radius="md"
          />
        </Fragment>
      );
    case "ollama":
      return (
        <Fragment>
          <Title order={6}>Ollama Configuation</Title>
          <Select
            label="Model Version"
            placeholder="Enter Model Version"
            radius="md"
            data={MOCK_OLLAMA_MODEL_VERSIONS}
          />
        </Fragment>
      );
    default:
      return null;
  }
}

/**
 * @param {{
 * title: string
 * responseRole: string
 * active: boolean
 * }} props
 * @returns {JSX.Element}
 */
function GetMessageHistoryItem({ title, responseRole, active }) {
  const { hovered, ref } = useHover();
  return (
    <NavLink
      ref={ref}
      label={<Title order={5}>{title}</Title>}
      rightSection={
        hovered ? (
          <ActionIcon variant="light" radius="md" color="red">
            <IoMdTrash />
          </ActionIcon>
        ) : (
          <Badge color="blue">{responseRole}</Badge>
        )
      }
      active={active}
      p="md"
    />
  );
}

export default function ChatBoxSection() {
  // LLM Model states
  const [modalOpened, { toggle: toggleModal }] = useDisclosure();
  /** @type {[string, (data: string | null) => void]} */
  const [selectedModel, setSelectedModel] = useState(null);
  // Messages states
  const [opened, { toggle }] = useDisclosure();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello, how can I help you today?" },
    { role: "human", content: "I need help with my document" },
  ]);

  /** @returns {JSX.Element} */
  function GetMessageChat() {
    return messages.length ? (
      <Flex
        direction="column-reverse"
        flex={1}
        px="md"
        style={{
          overflowY: "auto",
        }}
      >
        {messages.map((message, index) =>
          message.role === "assistant" ? (
            <GetAssistantChat key={index} content={message.content} />
          ) : (
            <GetHumanChat key={index} content={message.content} />
          )
        )}
      </Flex>
    ) : (
      <Flex flex={1} justify="center" w="100%" align="center">
        <Flex
          h="100%"
          direction="column"
          justify="center"
          align="center"
          gap="md"
        >
          <Text size="xl">What can I help you today?</Text>
          <Flex gap="md" wrap="wrap" justify="center">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <Card
                key={index}
                shadow="md"
                radius="md"
                p="md"
                w="200px"
                onClick={() => {}}
              >
                <Center c="gray">{prompt}</Center>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Flex>
    );
  }

  /** @returns {JSX.Element} */
  function GetInputBox() {
    return (
      <Flex p="md" direction="column" align="center" gap="sm">
        <Input
          placeholder="Enter message here"
          variant="filled"
          radius="xl"
          size="md"
          rightSection={<IoSend />}
          w="100%"
        />
        <Text align="right" c="gray" size="sm">
          AI may response incorrectly, please double check.
        </Text>
      </Flex>
    );
  }

  /** @returns {JSX.Element} */
  function GetLLMConfigModal() {
    return (
      <Modal
        opened={modalOpened}
        onClose={toggleModal}
        title="Select Model"
        radius="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction="column" gap="md">
          <Select
            data={LLM_MODEL_OPTIONS}
            placeholder="Select LLM Model"
            radius="md"
            allowDeselect={false}
            value={selectedModel}
            onChange={(value) => setSelectedModel(value)}
          />
          {selectedModel ? (
            <Flex
              direction="column"
              gap="sm"
              p="md"
              bg={appColors.lightGrey}
              style={{
                borderRadius: "16px",
              }}
            >
              <GetModelConfigByModel model={selectedModel} />
            </Flex>
          ) : null}
          <Flex justify="end" gap="sm">
            <Button
              variant="subtle"
              color="gray"
              radius="xl"
              onClick={toggleModal}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              radius="xl"
              onClick={() => {
                toggleModal();
              }}
            >
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Modal>
    );
  }

  /** @returns {JSX.Element} */
  function GetMessageHistory() {
    return (
      <ScrollArea h="100%">
        <GetMessageHistoryItem title="Chat Title" responseRole="Student" />
      </ScrollArea>
    );
  }

  return (
    <Flex direction="column" h="100%">
      <Flex p="md" justify="space-between">
        <Burger size="sm" opened={opened} onClick={toggle} />
        <Title order={4}>{opened ? "History" : "Chat Title"}</Title>
        {!opened ? (
          <Button
            variant={selectedModel ? "filled" : "outline"}
            radius="xl"
            color="gray"
            leftSection={<IoChevronDown />}
            onClick={toggleModal}
          >
            {selectedModel
              ? LLM_MODEL_OPTIONS.filter(
                  (option) => option.value === selectedModel
                )[0].label
              : "Select Model"}
          </Button>
        ) : (
          <Button radius="xl" leftSection={<IoAdd />} variant="light">
            New Chat
          </Button>
        )}
      </Flex>
      {!opened ? <GetMessageChat /> : <GetMessageHistory />}
      {!opened ? <GetInputBox /> : null}
      <GetLLMConfigModal />
    </Flex>
  );
}
