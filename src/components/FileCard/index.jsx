import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Image,
  Menu,
  Text,
  Title,
} from "@mantine/core";
import { appColors } from "../../utils/constants";
import { IoIosMore, IoMdTrash } from "react-icons/io";
import { IoOpenOutline } from "react-icons/io5";
import {
  getBgColorByFileType,
  getColorByStatus,
  getFailureVisualImageByFileType,
} from "../../utils/utilities";

/**
 * @param {{
 * fileName: string;
 * fileType: string;
 * uploadedDate: string;
 * status: string;
 * thumbnail: string;
 * onOpen: () => void;
 * onDelete: () => void;
 * }} props
 * @returns
 */
export default function FileCard({
  fileName,
  fileType,
  uploadedDate,
  status,
  thumbnail,
  onOpen,
  onDelete,
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section p="sm">
        <Image
          src={thumbnail}
          fallbackSrc={getFailureVisualImageByFileType(fileType)}
          fit="contain"
          alt={fileName}
          radius="md"
          h={100}
          bg={getBgColorByFileType(fileType)}
        />
      </Card.Section>
      <Card.Section px="md" pb="md">
        <Flex direction="column" gap={5}>
          <Flex justify="space-between" align="center">
            <Title order={5}>{fileName}</Title>
            <Menu shadow="md" width={150} position="bottom-end" radius="md">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IoIosMore />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IoOpenOutline />} onClick={onOpen}>
                  Open
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IoMdTrash />}
                  onClick={onDelete}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text size="sm" c={appColors.darkGrey}>
              {uploadedDate}
            </Text>
            <Badge autoContrast color={getColorByStatus(status)} size="sm">
              {status}
            </Badge>
          </Flex>
        </Flex>
      </Card.Section>
    </Card>
  );
}
