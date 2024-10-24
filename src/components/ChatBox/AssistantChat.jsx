import {
  ActionIcon,
  Anchor,
  CopyButton,
  Flex,
  List,
  Text,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * @param {{
 * content: string
 * isSpawnToken: boolean
 * spawnCompleteCallback: () => void
 * onRefClick: (ref: string) => void
 * }} props
 * @returns {JSX.Element}
 */
export default function AssistantChat({
  content,
  isSpawnToken = false,
  spawnCompleteCallback,
  onRefClick,
}) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isSpawnComplete, setIsSpawnComplete] = useState(false);
  const [references, setReferences] = useState([]);

  // Function to detect citations and replace with numbers
  const processCitations = useCallback(
    (text) => {
      let refList = [];
      let citationIndex = 1;
      const transformedContent = text.replace(/\[(.*?)\]/g, (match, p1) => {
        refList.push(p1.replace("File: ", "")); // Collect the citation link
        return `**${citationIndex++}**`; // Replace with a numbered citation
      });
      setReferences(refList); // Store the reference list
      return transformedContent;
    },
    [setReferences]
  );

  useEffect(() => {
    // If isSpawnToken is false, process and display the full content immediately
    if (!isSpawnToken) {
      const processedContent = processCitations(content);
      setDisplayedContent(processedContent);
      setIsSpawnComplete(true);
      return;
    }

    // Gradual token spawning logic (spawning 20 tokens at a time)
    let currentIndex = 0;
    const tokens = content.split("");
    const tokenBatchSize = 20;
    let fullContent = processCitations(content); // Process content for citations
    setIsSpawnComplete(false);

    const interval = setInterval(() => {
      if (currentIndex < tokens.length) {
        setDisplayedContent(
          (prev) =>
            prev +
            fullContent.slice(currentIndex, currentIndex + tokenBatchSize)
        );
        currentIndex += tokenBatchSize;
      } else {
        clearInterval(interval);
        setIsSpawnComplete(true);
        spawnCompleteCallback();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [content, isSpawnToken]);

  return (
    <Flex p="md">
      <Flex direction="column" gap="xs">
        <Markdown remarkPlugins={[remarkGfm]}>{displayedContent}</Markdown>
        {references.length > 0 && isSpawnComplete ? (
          <List type="ordered" size="sm">
            {references.map((ref, index) => (
              <List.Item key={index}>
                <Anchor onClick={() => onRefClick(ref)}>{ref}</Anchor>
              </List.Item>
            ))}
          </List>
        ) : null}
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
