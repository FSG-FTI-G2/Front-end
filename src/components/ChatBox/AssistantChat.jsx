import {
  ActionIcon,
  Anchor,
  Badge,
  CopyButton,
  Flex,
  List,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useGlobalStore from "../../context/global";

/**
 * @param {{
 * content: string
 * citations: Record<string, CitationData>
 * isSpawnToken: boolean
 * spawnCompleteCallback: () => void
 * }} props
 * @returns {JSX.Element}
 */
export default function AssistantChat({
  content,
  citations = {},
  isSpawnToken = false,
  spawnCompleteCallback,
}) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isSpawnComplete, setIsSpawnComplete] = useState(false);
  const files = useGlobalStore((state) => state.files);

  // Function to detect citations and replace with numbers
  const processCitations = useCallback((text) => {
    const transformedContent = text.replace(/\[(.*?)\]/g, (match, p) => {
      return ` **${match}**`; // Replace with a numbered citation
    });
    return transformedContent;
  }, []);

  const getDocumentByCitation = useCallback(
    /** @type {(documentId: string) => DisplayedFile | undefined} */
    (documentId) => {
      return files.find((file) => file.id === documentId);
    },
    [files]
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
        {Object.keys(citations).length > 0 && isSpawnComplete ? (
          <List type="ordered" size="sm">
            {Object.keys(citations).map((citeKey, index) => (
              <List.Item
                key={index}
                icon={
                  <Badge variant="light" size="sm">
                    {citeKey.slice(1, -1)}
                  </Badge>
                }
              >
                <Anchor
                  href={`/file/${citations[citeKey].document}?ref=${citations[citeKey].chunk}`}
                  target="_blank"
                  underline="hover"
                >
                  {getDocumentByCitation(citations[citeKey].document)?.fileName}
                </Anchor>
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
