import { Flex } from "@mantine/core";
import { containerStyle } from "../styles/containerStyle";

export default function Section({ flex, children }) {
  return (
    <Flex flex={flex} style={{ ...containerStyle }} direction="column" h="100%">
      {children}
    </Flex>
  );
}
