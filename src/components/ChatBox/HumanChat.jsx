import { Flex, Text } from "@mantine/core";
import { appColors } from "../../utils/constants";

/**
 * @param {{
 * content: string
 * }} props
 * @returns {JSX.Element}
 */
export default function HumanChat({ content }) {
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
