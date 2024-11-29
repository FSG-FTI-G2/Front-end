import { Flex, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { getUrlContent } from "../../utils/utilities";
import { appColors } from "../../utils/constants";

/**
 *
 * @param {{
 * url: string
 * }} props
 * @returns {JSX.Element}
 */
export default function TXTPreview({ url }) {
  /** @type {[string, (data: string) => void]} */
  const [data, setData] = useState(null);

  useEffect(() => {
    getUrlContent(url).then((text) => setData(text));
  }, []);

  return (
    <ScrollArea bg={appColors.lightGrey} w="100%">
      <Flex p="md">{data}</Flex>
    </ScrollArea>
  );
}
