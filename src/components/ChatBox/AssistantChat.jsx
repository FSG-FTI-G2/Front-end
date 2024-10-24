import { ActionIcon, CopyButton, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import Markdown from "react-markdown";

/**
 * @param {{
 * content: string
 * isSpawnToken: boolean
 * spawnCompleteCallback: () => void
 * }} props
 * @returns {JSX.Element}
 */
export default function AssistantChat({
  content,
  isSpawnToken = false,
  spawnCompleteCallback,
}) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isSpawnComplete, setIsSpawnComplete] = useState(false);

  useEffect(() => {
    if (!isSpawnToken) {
      setDisplayedContent(content);
      setIsSpawnComplete(true);
      return;
    }

    let currentIndex = 0;
    const tokens = content.split(""); // Split by characters or words based on your preference
    const tokenBatchSize = 20; // Number of tokens per interval
    setIsSpawnComplete(false);

    const interval = setInterval(() => {
      if (currentIndex < tokens.length) {
        setDisplayedContent(
          (prev) =>
            prev +
            tokens.slice(currentIndex, currentIndex + tokenBatchSize).join("")
        );
        currentIndex += tokenBatchSize;
      } else {
        clearInterval(interval);
        setIsSpawnComplete(true);
        spawnCompleteCallback();
      }
    }, 50); // Adjust the delay for faster or slower token spawning

    return () => clearInterval(interval); // Clean up on component unmount
  }, [content, isSpawnToken]);

  return (
    <Flex p="md">
      <Flex direction="column" gap="xs">
        <Markdown>{displayedContent}</Markdown>
        {isSpawnComplete ? (
          <Flex>
            <ActionIcon variant="subtle" radius="md" color="gray">
              <AiFillLike />
            </ActionIcon>
            <ActionIcon variant="subtle" radius="md" color="gray">
              <AiFillDislike />
            </ActionIcon>
            <CopyButton value={content}>
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
        ) : null}
      </Flex>
    </Flex>
  );
}
