import {
  Button,
  Flex,
  Modal,
  PasswordInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Fragment, useRef, useState } from "react";
import { appColors, LLMModelOptions } from "../../utils/constants";

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
 * model: string
 * config: LLMConfigData
 * opened: boolean
 * toggle: () => void
 * onOk: (model: string, config: ModelConfig) => void
 * }} props
 * @returns {JSX.Element}
 */
export default function LLMConfigModal({ config, opened, toggle, onOk }) {
  const [selectedModel, setSelectedModel] = useState(config.selected_model);
  const configRef = useRef(config.config[selectedModel]);

  /**
   * @param {{
   * model: string
   * }} model
   * */
  function GetModelConfig({ model }) {
    const form = useForm({
      initialValues: configRef.current,
      onValuesChange: (values) => {
        configRef.current = values;
      },
    });

    switch (model) {
      case "openai":
        return (
          <Fragment>
            <Title order={6}>OpenAI Configuation</Title>
            <TextInput
              label="Model Name"
              placeholder="Enter Model Name"
              radius="md"
              value={form.key("name_model") || ""}
              {...form.getInputProps("name_model")}
            />
            <PasswordInput
              label="API Key"
              placeholder="Enter API Key"
              radius="md"
              value={form.key("api_key") || ""}
              {...form.getInputProps("api_key")}
            />
          </Fragment>
        );
      case "azure_openai":
        return (
          <Fragment>
            <Title order={6}>Azure OpenAI Configuation</Title>
            <TextInput
              label="API Endpoint"
              placeholder="Enter API Endpoint"
              radius="md"
              value={form.key("endpoint") || ""}
              {...form.getInputProps("endpoint")}
            />
            <TextInput
              label="Model Name"
              placeholder="Enter Model Name"
              radius="md"
              value={form.key("name_model") || ""}
              {...form.getInputProps("name_model")}
            />
            <PasswordInput
              label="API Key"
              placeholder="Enter API Key"
              radius="md"
              value={form.key("api_key") || ""}
              {...form.getInputProps("api_key")}
            />
          </Fragment>
        );
      case "google_gemini":
        return (
          <Fragment>
            <Title order={6}>Gemini Configuation</Title>
            <PasswordInput
              label="API Key"
              placeholder="Enter API Key"
              radius="md"
              value={form.key("api_key") || ""}
              {...form.getInputProps("api_key")}
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
              allowDeselect={false}
              value={form.key("name_model") || ""}
              {...form.getInputProps("name_model")}
            />
          </Fragment>
        );
      default:
        return null;
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={toggle}
      title="Select Model"
      radius="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Flex direction="column" gap="md">
        <Select
          data={LLMModelOptions}
          placeholder="Select LLM Model"
          radius="md"
          allowDeselect={false}
          value={selectedModel}
          onChange={(value) => {
            setSelectedModel(value);
            configRef.current = config.config[value];
          }}
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
            <GetModelConfig model={selectedModel} />
          </Flex>
        ) : null}
        <Flex justify="end" gap="sm">
          <Button variant="subtle" color="gray" radius="xl" onClick={toggle}>
            Cancel
          </Button>
          <Button
            variant="filled"
            radius="xl"
            onClick={() => {
              toggle();
              onOk(selectedModel, configRef.current);
            }}
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
