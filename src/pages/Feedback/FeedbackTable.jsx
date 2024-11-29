import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Highlight,
  Input,
  NumberInput,
  Pagination,
  Popover,
  Radio,
  Skeleton,
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
import Empty from "../../components/Empty";
import {
  deleteFeedback,
  getFeedback,
  updateFeedbackStatus,
} from "../../apis/feedback";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

/**
 * @param {{
 * skeletons: number[]
 * }} props
 */
const GetTableSkeleton = ({ skeletons = [] }) => {
  const col = skeletons[0] || 5;
  const row = skeletons[1] || 3;
  return (
    <>
      {[...Array(row)].map((_, index) => (
        <Table.Tr key={index}>
          {[...Array(col)].map((_, index) => (
            <Table.Td key={index}>
              <Skeleton height={30} />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
};

export default function FeedbackTable() {
  const setAppTitle = useGlobalStore((state) => state.setAppTitle);
  const [loading, setLoading] = useState(true);
  /** @type {[number[], (status: number[]) => void]} */
  const [evaluateStatusFilter, setEvaluateStatusFilter] = useState([]);
  const [sortFilter, setSortFilter] = useState("none");
  const [search, setSearch] = useState("");
  const [searchDebounceValue] = useDebouncedValue(search, 500);
  /** @type {[string[], (rows: string[]) => void]} */
  const [selectedRows, setSelectedRows] = useState([]);
  /** @type {[FeedbackData[], (data: FeedbackData[]) => void]} */
  const [rows, setRows] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDeselected = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleGetFeedback = useCallback(() => {
    setLoading(true);
    // Fetch feedback data
    getFeedback({
      pageSize,
      pageIndex: pageIndex - 1,
      search: searchDebounceValue,
      evaluationStatus: evaluateStatusFilter,
      sortBy: sortFilter,
      onSuccess: (data) => {
        setRows(data.data);
        setTotalPage(data.total_pages + 1);
        setLoading(false);
      },
      onFail: (message) => {
        console.error(message);
        setLoading(false);
      },
    });
  }, [
    pageIndex,
    pageSize,
    searchDebounceValue,
    evaluateStatusFilter,
    sortFilter,
  ]);

  const handleUpdateEvaluationFeedback = useCallback(
    /**
     * @param {string} feedbackId
     * @param {number} status
     */
    (feedbackId, status) => {
      let ids = [feedbackId];
      if (selectedRows.length !== 0 && selectedRows.includes(feedbackId)) {
        ids = selectedRows;
      }
      updateFeedbackStatus({
        feedbackIds: ids,
        evaluationStatus: status,
        onSuccess: (message) => {
          handleGetFeedback();
          notifications.show({
            title: "Success",
            message,
            color: "green",
          });
        },
        onFail: (message) => {
          notifications.show({
            title: "Error",
            message,
            color: "red",
          });
        },
      });
    },
    [selectedRows, handleGetFeedback]
  );

  const handleDeleteSelectedRows = useCallback(() => {
    deleteFeedback({
      feedbackIds: selectedRows,
      onSuccess: () => {
        setSelectedRows([]);
        handleGetFeedback();
        notifications.show({
          title: "Success",
          message: "Feedback has been deleted",
          color: "green",
        });
      },
      onFail: (message) => {
        notifications.show({
          title: "Error",
          message,
          color: "red",
        });
      },
    });
  }, [selectedRows, handleGetFeedback]);

  // Set app title
  useEffect(() => {
    setAppTitle("Human Feedback");
  }, []);

  // Fetch feedback data
  useEffect(() => {
    handleGetFeedback();
  }, [
    pageIndex,
    pageSize,
    searchDebounceValue,
    evaluateStatusFilter,
    sortFilter,
  ]);

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
          <Highlight highlight={searchDebounceValue}>{row.question}</Highlight>
        </Table.Td>
        <Table.Td>
          <Highlight highlight={searchDebounceValue}>{row.answer}</Highlight>
        </Table.Td>
        <Table.Td>
          <Flex wrap="wrap" gap="xs">
            {row.documents.map((document, index) => (
              <Anchor
                key={index}
                href={`/file/${document.document}?ref=${document.chunk}`}
                target="_blank"
                underline="hover"
              >
                {index + 1}
              </Anchor>
            ))}
          </Flex>
        </Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon
              variant="subtle"
              radius="md"
              size="lg"
              color="gray"
              onClick={() => handleUpdateEvaluationFeedback(row.id, 1)}
            >
              {row.evaluation === 1 ? <BiSolidLike /> : <BiLike />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              radius="md"
              size="lg"
              color="gray"
              onClick={() => handleUpdateEvaluationFeedback(row.id, -1)}
            >
              {row.evaluation === -1 ? <BiSolidDislike /> : <BiDislike />}
            </ActionIcon>
          </ActionIcon.Group>
        </Table.Td>
      </Table.Tr>
    ));
  }, [rows, selectedRows, searchDebounceValue, pageSize]);

  return (
    <Flex direction="column" h="100%">
      <Flex p="md">
        <Flex gap="md">
          <Input
            placeholder="Search"
            leftSection={<IoIosSearch />}
            radius="xl"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
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
                    <Checkbox label="Good" value="1" radius="md" />
                    <Checkbox label="Bad" value="-1" radius="md" />
                    <Checkbox label="Unset" value="0" radius="md" />
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
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="lg"
                  radius="md"
                  onClick={handleDeleteSelectedRows}
                >
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
                  checked={selectedRows.length === rows.length && rows.length}
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
            {loading ? (
              <GetTableSkeleton />
            ) : rows.length ? (
              <GetRows />
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center>
                    <Empty text="No message has been sent" />
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Flex p="md" justify="space-between">
        <Flex align="center" gap="sm">
          <Title order={5}>Rows per page</Title>
          <NumberInput
            min={1}
            max={100}
            radius="md"
            value={pageSize}
            onChange={(value) => setPageSize(value)}
          />
        </Flex>
        <Pagination.Root
          total={totalPage}
          radius="md"
          value={pageIndex}
          onChange={(value) => setPageIndex(value)}
        >
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
