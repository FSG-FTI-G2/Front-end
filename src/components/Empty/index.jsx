import { Flex, Text } from "@mantine/core";
import emptyImage from "../../assets/images/empty.png";
import { appColors } from "../../utils/constants";

/**
 * @param {{
 * text: string;
 * children: React.ReactNode;
 * }} props
 * @returns {JSX.Element}
 */
export default function Empty({ text, children }) {
  return (
    <Flex direction="column" align="center" gap={10}>
      <img
        src={emptyImage}
        alt="empty"
        style={{
          width: "3rem",
        }}
      />
      <Text c={appColors.darkGrey}>{text}</Text>
      {children}
    </Flex>
  );
}
