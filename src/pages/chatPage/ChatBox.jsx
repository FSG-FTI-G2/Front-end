import {
  Burger,
  Button,
  Card,
  Center,
  Flex,
  ScrollArea,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoAdd, IoChevronDown } from "react-icons/io5";
import {
  ExamplePrompts,
  LLMModelOptions,
  SelectRolePromptOptions,
} from "../../utils/constants";
import { useCallback, useEffect, useState } from "react";
import { getLLMConfig, updateLLMConfig } from "../../apis/llm";
import useGlobalStore from "../../context/global";
import { notifications } from "@mantine/notifications";
import {
  deleteChatMessage,
  getChatMessageById,
  getChats,
  sendChatMessage,
} from "../../apis/chat";
import AssistantChat from "../../components/ChatBox/AssistantChat";
import HumanChat from "../../components/ChatBox/HumanChat";
import LLMConfigModal from "../../components/ChatBox/LLMConfigModal";
import MessageHistoryItem from "../../components/ChatBox/MessageHistoryItem";
import ChatInput from "../../components/ChatBox/ChatInput";
import { useNavigate } from "react-router-dom";

export default function ChatBoxSection() {
  const navigator = useNavigate();
  // LLM Model states
  const [modalOpened, { toggle: toggleModal }] = useDisclosure();
  const llmConfig = useGlobalStore((state) => state.llmConfig);
  const setLLMConfig = useGlobalStore((state) => state.setLLMConfig);
  /** @type {[string, (data: string | null) => void]} */
  const [selectedModel, setSelectedModel] = useState(null);
  // Messages states
  const [opened, { toggle }] = useDisclosure();
  const setChatMessages = useGlobalStore((state) => state.setChatMessages);
  // Chat states
  const chats = useGlobalStore((state) => state.chats);
  const setChats = useGlobalStore((state) => state.setChats);
  const [currentChatIndex, setCurrentChatIndex] = useState(-1);
  // Message Input state
  const [rolePrompt, setRolePrompt] = useState(
    SelectRolePromptOptions[0].value
  );
  const [loading, setLoading] = useState(false);
  const [shouldSpawnToken, setShouldSpawnToken] = useState(false);
  /** @type {[MessageData, (data: MessageData | null) => void]} */
  const [temporalUserMessage, setTemporalUserMessage] = useState(null);
  // Files
  const files = useGlobalStore((state) => state.files);

  const handleUpdateLLMConfig = useCallback(
    /**
     * @param {string} model
     * @param {ModelConfig} config
     */
    (model, config) => {
      updateLLMConfig({
        selectedModel: model,
        config,
        onSuccess: (data) => {
          setSelectedModel(model);
          setLLMConfig(data);
          notifications.show({
            title: "Success",
            message: "LLM Model updated successfully",
            color: "teal",
          });
        },
        onFail: (message) =>
          notifications.show({ title: "Error", message, color: "red" }),
      });
    },
    [setSelectedModel, setLLMConfig]
  );

  const handleGetMessages = useCallback(
    /** @param {string} chatId */
    (chatId) => {
      getChatMessageById({
        messageId: chatId,
        onSuccess: (data) => setChatMessages(chatId, data.reverse()),
        onFail: (message) =>
          notifications.show({
            title: "Error",
            message,
            color: "red",
          }),
      });
    },
    [setChatMessages]
  );

  const handleSendMessage = useCallback(
    /** @param {string} message */
    (message) => {
      // Get message id and role
      let messageId = null;
      let role = null;
      if (currentChatIndex !== -1) {
        messageId = chats[currentChatIndex].id;
      }
      if (currentChatIndex !== -1) {
        role = chats[currentChatIndex].role_prompt;
      } else {
        role = rolePrompt;
      }

      // Set User Message to Temporal Data
      setTemporalUserMessage({
        role: "user",
        content: message,
      });

      // Send message
      setLoading(true);
      sendChatMessage({
        message,
        messageId,
        role,
        onSuccess: (data) => {
          setLoading(false);
          setShouldSpawnToken(true);
          const newChats = [...chats];
          if (currentChatIndex === -1) {
            newChats.unshift({
              ...data,
              messages: [...data.messages.reverse()],
            });
            setCurrentChatIndex(0);
          } else {
            newChats[currentChatIndex] = {
              ...data,
              messages: [...data.messages.reverse()],
            };
          }
          setChats(newChats);
          setTemporalUserMessage(null);
        },
        onFail: (message) =>
          notifications.show({
            title: "Error",
            message,
            color: "red",
          }),
      });
    },
    [
      currentChatIndex,
      chats,
      rolePrompt,
      setChats,
      setTemporalUserMessage,
      setLoading,
    ]
  );

  const handleDeleteMessage = useCallback(
    /** @param {string} chatId */
    (chatId) => {
      // Send message
      deleteChatMessage({
        messageId: chatId,
        onSuccess: () => {
          const newChats = chats.filter((chat) => chat.id !== chatId);
          setChats(newChats);
          // Set the current chat index to the closest chat
          if (
            chats[currentChatIndex]?.id === chatId &&
            currentChatIndex !== -1
          ) {
            setCurrentChatIndex(
              currentChatIndex === 0 ? 0 : currentChatIndex - 1
            );
          }
          toggle();
        },
        onFail: (message) =>
          notifications.show({
            title: "Error",
            message,
            color: "red",
          }),
      });
    },
    [chats, setCurrentChatIndex, setChats]
  );

  const handleOpenRef = useCallback(
    /** @param {string} ref */
    (ref) => {
      // Find the files with the reference as name
      const file = files.filter((file) => file.fileName === ref)[0];
      if (file) {
        navigator(`/file/${file.id}`);
      }
    },
    [files]
  );

  function GetMessageChatContents() {
    return chats[currentChatIndex]?.messages.length || temporalUserMessage ? (
      <Flex
        direction="column-reverse"
        flex={1}
        px="md"
        style={{
          overflowY: "auto",
        }}
      >
        {temporalUserMessage ? (
          <HumanChat content={temporalUserMessage.content} />
        ) : null}
        {chats[currentChatIndex]?.messages.map((message, index) =>
          message.type === "ai" ? (
            <AssistantChat
              key={index}
              content={message.content}
              isSpawnToken={index === 0 && shouldSpawnToken}
              spawnCompleteCallback={() => setShouldSpawnToken(false)}
              onRefClick={handleOpenRef}
            />
          ) : (
            <HumanChat key={index} content={message.content} />
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
            {ExamplePrompts.map((prompt, index) => (
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

  function GetMessageHistory() {
    return (
      <ScrollArea h="100%">
        {chats.map((chat, index) => (
          <MessageHistoryItem
            key={chat.id}
            title={chat.title}
            responseRole={chat.role_prompt}
            active={index === currentChatIndex}
            onClick={() => {
              setCurrentChatIndex(index);
              toggle();
            }}
            onDelete={() => handleDeleteMessage(chat.id)}
          />
        ))}
      </ScrollArea>
    );
  }

  // Get initial data
  useEffect(() => {
    getLLMConfig({
      onSuccess: (data) => {
        setLLMConfig(data);
        setSelectedModel(data.selected_model);
      },
      onFail: (message) =>
        notifications.show({ title: "Error", message, color: "red" }),
    });
    getChats({
      onSuccess: (data) => {
        setChats(data.reverse());
        // Get messages of the first chat
        data[currentChatIndex] && handleGetMessages(data[currentChatIndex].id);
      },
      onFail: (message) =>
        notifications.show({ title: "Error", message, color: "red" }),
    });
  }, []);

  // Get the chat messages when the index changes
  useEffect(() => {
    if (chats[currentChatIndex]?.messages.length === 0) {
      handleGetMessages(chats[currentChatIndex].id);
    }
  }, [currentChatIndex]);

  return (
    <Flex direction="column" h="100%">
      <Flex p="md" justify="space-between">
        <Burger size="sm" opened={opened} onClick={toggle} />
        <Title order={4}>
          {opened ? "History" : chats[currentChatIndex]?.title}
        </Title>
        {!opened ? (
          <Button
            variant={selectedModel ? "filled" : "outline"}
            radius="xl"
            color="gray"
            leftSection={<IoChevronDown />}
            onClick={toggleModal}
          >
            {selectedModel
              ? LLMModelOptions.filter(
                  (option) => option.value === selectedModel
                )[0].label
              : "Select Model"}
          </Button>
        ) : (
          <Button
            radius="xl"
            leftSection={<IoAdd />}
            variant="light"
            onClick={() => {
              setCurrentChatIndex(-1);
              toggle();
            }}
          >
            New Chat
          </Button>
        )}
      </Flex>
      {!opened ? <GetMessageChatContents /> : <GetMessageHistory />}
      {!opened ? (
        <ChatInput
          loading={loading}
          onMessage={handleSendMessage}
          leftSection={
            currentChatIndex === -1 ? (
              <Select
                placeholder="Role"
                data={SelectRolePromptOptions}
                value={rolePrompt}
                onChange={(value) => setRolePrompt(value)}
                allowDeselect={false}
                radius="xl"
                size="md"
                w={150}
              />
            ) : null
          }
        />
      ) : null}
      {llmConfig ? (
        <LLMConfigModal
          config={llmConfig}
          opened={modalOpened}
          toggle={toggleModal}
          onOk={handleUpdateLLMConfig}
        />
      ) : null}
    </Flex>
  );
}
