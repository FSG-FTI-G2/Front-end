import {
  ActionIcon,
  ActionIconGroup,
  Anchor,
  Button,
  Checkbox,
  Flex,
  Group,
  Highlight,
  Input,
  NumberInput,
  Pagination,
  Popover,
  Radio,
  Table,
  Title,
  Transition,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoFilter, IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import useGlobalStore from "../../context/global";

const mockData = [
  {
    id: "123",
    question: "What is your name?",
    answer: "My name is John Doe",
    documents: ["file1.pdf", "file2.pdf"],
    evaluation: 0,
  },
  {
    id: "456",
    question: "What is your name?",
    answer: "My name is John Doe",
    documents: ["file1.pdf", "file2.pdf"],
    evaluation: -1,
  },
];

export default function FeedbackTable() {
  const setAppTitle = useGlobalStore((state) => state.setAppTitle);
  const [evaluateStatusFilter, setEvaluateStatusFilter] = useState([]);
  const [sortFilter, setSortFilter] = useState("none");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState(mockData);
  const [pageSize, setPageSize] = useState(10);

  const handleDeselected = useCallback(() => {
    setSelectedRows([]);
  }, []);

  useEffect(() => {
    setAppTitle("Human Feedback");
  }, []);

  const GetRows = useCallback(() => {
    return rows.map((row) => (
      <Table.Tr
        key={row.id}
        bg={
          selectedRows.includes(row.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            aria-label="Select row"
            checked={selectedRows.includes(row.id)}
            onChange={(event) =>
              setSelectedRows(
                event.currentTarget.checked
                  ? [...selectedRows, row.id]
                  : selectedRows.filter((position) => position !== row.id)
              )
            }
            radius="md"
          />
        </Table.Td>
        <Table.Td>
          <Highlight highlight={search}>{row.question}</Highlight>
        </Table.Td>
        <Table.Td>
          <Highlight highlight={search}>{row.answer}</Highlight>
        </Table.Td>
        <Table.Td>
          <Flex wrap="wrap" gap="xs">
            {row.documents.map((document, index) => (
              <Anchor
                key={index}
                href={`/file/${document}`}
                target="_blank"
                underline="hover"
              >
                {document}
              </Anchor>
            ))}
          </Flex>
        </Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon variant="subtle" radius="md" size="lg" color="gray">
              {row.evaluation === 1 ? <BiSolidLike /> : <BiLike />}
            </ActionIcon>
            <ActionIcon variant="subtle" radius="md" size="lg" color="gray">
              {row.evaluation === -1 ? <BiSolidDislike /> : <BiDislike />}
            </ActionIcon>
          </ActionIcon.Group>
        </Table.Td>
      </Table.Tr>
    ));
  }, [rows, selectedRows, search, pageSize]);

  return (
    <Flex direction="column" h="100%">
      <Flex p="md">
        <Flex gap="md">
          <Input
            placeholder="Search"
            leftSection={<IoIosSearch />}
            radius="xl"
          />

          <Popover shadow="md" width={200} position="bottom" radius="md">
            <Popover.Target>
              <Button
                color="gray"
                variant={
                  evaluateStatusFilter.length || sortFilter !== "none"
                    ? "filled"
                    : "outline"
                }
                radius="xl"
                leftSection={<IoFilter />}
              >
                Filter
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Flex direction="column" gap={20}>
                <Title order={6}>Evaluation Status</Title>
                <Checkbox.Group
                  value={evaluateStatusFilter}
                  onChange={setEvaluateStatusFilter}
                >
                  <Flex direction="column" gap={10}>
                    <Checkbox label="Good" value="good" radius="md" />
                    <Checkbox label="Bad" value="bad" radius="md" />
                    <Checkbox label="Unset" value="unset" radius="md" />
                  </Flex>
                </Checkbox.Group>
                <Title order={6}>Sort</Title>
                <Radio.Group
                  value={sortFilter}
                  onChange={setSortFilter}
                  radius="md"
                >
                  <Flex direction="column" gap={10}>
                    <Radio value="none" label="None" />
                    <Radio value="asc" label="Ascending" />
                    <Radio value="desc" label="Descending" />
                  </Flex>
                </Radio.Group>
              </Flex>
            </Popover.Dropdown>
          </Popover>

          <Transition
            mounted={selectedRows.length}
            transition="slide-up"
            duration={100}
            timingFunction="ease"
          >
            {(styles) => (
              <Flex align="center" style={styles}>
                <Title order={5} pr="md">
                  {selectedRows.length} selected
                </Title>
                <ActionIcon variant="subtle" color="red" size="lg" radius="md">
                  <FaTrash />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  radius="md"
                  onClick={handleDeselected}
                >
                  <IoClose />
                </ActionIcon>
              </Flex>
            )}
          </Transition>
        </Flex>
      </Flex>

      <Table.ScrollContainer flex={1}>
        <Table striped horizontalSpacing="md" verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  radius="md"
                  checked={selectedRows.length === rows.length}
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < rows.length
                  }
                  onChange={(event) =>
                    setSelectedRows(
                      event.currentTarget.checked
                        ? rows.map((row) => row.id)
                        : []
                    )
                  }
                />
              </Table.Th>
              <Table.Th>Question</Table.Th>
              <Table.Th>Answer</Table.Th>
              <Table.Th>Documents</Table.Th>
              <Table.Th>Evaluation</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <GetRows />
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Flex p="md" justify="space-between">
        <Flex align="center" gap="sm">
          <Title order={5}>Rows per page</Title>
          <NumberInput defaultValue={10} min={1} max={100} radius="md" />
        </Flex>
        <Pagination.Root total={10} radius="md">
          <Group gap={5} justify="center">
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
          </Group>
        </Pagination.Root>
      </Flex>
    </Flex>
  );
}
