import {
  Button,
  Checkbox,
  FileButton,
  Flex,
  Grid,
  Input,
  Popover,
  ScrollArea,
  Skeleton,
  Title,
} from "@mantine/core";
import { IoIosCloudUpload, IoIosSearch, IoMdClose } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import {
  fileAcceptance,
  gridBreakpoints,
  gridSpan,
} from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import FileCard from "../../components/FileCard";
import Empty from "../../components/Empty";
import { Dropzone } from "@mantine/dropzone";
import { deleteFile, getFiles, uploadFiles } from "../../apis/files";
import useGlobalStore from "../../context/global";
import { formatLongFileName, formatDateString } from "../../utils/utilities";
import { notifications } from "@mantine/notifications";
import { useDebouncedValue } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

/**
 * @param {File[]} selectedFiles
 * @returns {DisplayedFile[]}
 */
const parseFileObject = (selectedFiles) => {
  return selectedFiles.map((file, index) => ({
    id: index,
    fileName: file.name,
    fileType: file.name.split(".").pop(),
    uploadedDate: new Date().toISOString().split("T")[0],
    status: "pending",
  }));
};

/**
 * @param {FileData[]} files
 * @returns {DisplayedFile[]}
 */
const parseFileData = (files) => {
  return files.map((file) => ({
    id: file.id,
    fileName: file.file_name,
    fileType: file.type,
    uploadedDate: formatDateString(file.created_at),
    status: file.status,
  }));
};

/**
 * @returns {React.ReactNode[]}
 */
function GetSkeletonFiles() {
  return [1, 2, 3].map((index) => (
    <Grid.Col key={index} span={gridSpan}>
      <Skeleton height={200} radius="md" />
    </Grid.Col>
  ));
}

export default function UploadFileSection() {
  const navigator = useNavigate();
  // Files State
  const [fileLoading, setFileLoading] = useState(false);
  const files = useGlobalStore((state) => state.files);
  const setFiles = useGlobalStore((state) => state.setFiles);
  const setFilesStatus = useGlobalStore((state) => state.setFilesStatus);
  // Search State
  const [fileSearch, setFileSearch] = useState("");
  const [fileSearchDebounce] = useDebouncedValue(fileSearch, 500);
  const [fileTypeFilter, setFileTypeFilter] = useState([]);
  const [fileStatusFilter, setFileStatusFilter] = useState([]);
  // Scroll State
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const scrollViewport = useRef(null);
  const scrollElement = useRef(null);
  const [filePageIndex, setFilePageIndex] = useState(0);
  const [fileTotalPages, setFileTotalPages] = useState(0);

  /** @param {File[]} selectedFiles */
  const handleUploadFiles = (selectedFiles) => {
    if (selectedFiles.length) {
      uploadFiles({
        files: selectedFiles,
        onProgress: (progressData) => setFilesStatus(progressData.status),
        onSuccess: (progressData) => {
          setFilesStatus(progressData.status);
          handleViewFiles();
        },
        onFail: (message) =>
          notifications.show({
            title: "Something went wrong!",
            message: message,
            color: "red",
          }),
      });
    }
  };

  /**
   * @param {number} pageIndex
   * @param {string} search
   * @param {string} type
   * @param {string} status
   * @param {boolean} concatFiles
   */
  const handleViewFiles = (
    pageIndex,
    search,
    type,
    status,
    concatFiles = false
  ) => {
    setFileLoading(true);
    getFiles({
      pageIndex: pageIndex,
      search: search,
      fileType: type,
      status: status,
      onSuccess: (data) => {
        setFileTotalPages(data.total_pages);
        if (concatFiles) {
          setFiles([...files, ...parseFileData(data.files)]);
        } else {
          setFiles(parseFileData(data.files));
        }
        setFileLoading(false);
      },
      onFail: (message) => {
        notifications.show({
          title: "Something went wrong!",
          message: message,
          color: "red",
        });
        setFileLoading(false);
      },
    });
  };

  /** @param {string} id */
  const handleDeleteFile = (id) => {
    deleteFile({
      id,
      onSuccess: (message) => {
        notifications.show({
          title: "Delete",
          message: message,
          color: "green",
        });
        setFiles(files.filter((file) => file.id !== id));
      },
      onFail: (message) =>
        notifications.show({
          title: "Error",
          message: message,
          color: "red",
        }),
    });
  };

  useEffect(() => {
    setFilePageIndex(0);
    handleViewFiles(
      0,
      fileSearchDebounce,
      fileTypeFilter.length && fileTypeFilter.join(","),
      fileStatusFilter.length && fileStatusFilter.join(",")
    );
  }, [fileSearchDebounce, fileTypeFilter, fileStatusFilter]);

  useEffect(() => {
    if (
      Math.ceil(scrollPosition.y + scrollElement.current?.clientHeight) ===
        scrollViewport.current?.scrollHeight &&
      fileTotalPages > filePageIndex
    ) {
      setFilePageIndex(filePageIndex + 1);
      handleViewFiles(
        filePageIndex + 1,
        fileSearchDebounce,
        fileTypeFilter.length && fileTypeFilter.join(","),
        fileStatusFilter.length && fileStatusFilter.join(","),
        true
      );
    }
  }, [scrollPosition]);

  return (
    <Flex direction="column" h="100%">
      <Flex p="md" justify="space-between">
        <FileButton
          leftSection={<IoIosCloudUpload />}
          radius="xl"
          accept={fileAcceptance}
          multiple
          onChange={(selectedFiles) => {
            handleUploadFiles(selectedFiles);
            setFiles([...parseFileObject(selectedFiles), ...files]);
          }}
        >
          {(props) => <Button {...props}>Upload</Button>}
        </FileButton>
        <Flex gap={10}>
          <Popover shadow="md" width={200} position="bottom" radius="md">
            <Popover.Target>
              <Button
                color="gray"
                variant={
                  fileTypeFilter.length || fileStatusFilter.length
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
                <Title order={6}>File Type</Title>
                <Checkbox.Group
                  value={fileTypeFilter}
                  onChange={setFileTypeFilter}
                >
                  <Flex direction="column" gap={10}>
                    <Checkbox label="PDF" value="pdf" radius="md" />
                    <Checkbox label="DOCX" value="docx" radius="md" />
                    <Checkbox label="TXT" value="txt" radius="md" />
                  </Flex>
                </Checkbox.Group>
                <Title order={6}>Status</Title>
                <Checkbox.Group
                  value={fileStatusFilter}
                  onChange={setFileStatusFilter}
                >
                  <Flex direction="column" gap={10}>
                    <Checkbox label="Pending" value="pending" radius="md" />
                    <Checkbox label="Uploading" value="uploading" radius="md" />
                    <Checkbox
                      label="Processing"
                      value="processing"
                      radius="md"
                    />
                    <Checkbox label="Success" value="success" radius="md" />
                    <Checkbox label="Error" value="error" radius="md" />
                  </Flex>
                </Checkbox.Group>
              </Flex>
            </Popover.Dropdown>
          </Popover>
          <Input
            placeholder="Search"
            radius="xl"
            leftSection={<IoIosSearch />}
            value={fileSearch}
            onChange={(event) => setFileSearch(event.currentTarget.value)}
          />
        </Flex>
      </Flex>
      {files.length || fileLoading ? (
        <ScrollArea
          ref={scrollElement}
          viewportRef={scrollViewport}
          px="md"
          h="100%"
          scrollbars="y"
          onScrollPositionChange={onScrollPositionChange}
        >
          <Grid w="100%" breakpoints={gridBreakpoints}>
            {files.length
              ? files.map((file) => (
                  <Grid.Col key={file.id} span={gridSpan}>
                    <FileCard
                      fileName={formatLongFileName(file.fileName, 15)}
                      fileType={file.fileType}
                      uploadedDate={file.uploadedDate}
                      status={file.status}
                      thumbnail=""
                      onDelete={() => handleDeleteFile(file.id)}
                      onOpen={() => navigator(`/file/${file.id}`)}
                    />
                  </Grid.Col>
                ))
              : null}
            {fileLoading ? <GetSkeletonFiles /> : null}
          </Grid>
        </ScrollArea>
      ) : (
        <Flex h="100%" justify="center" align="center">
          <Empty text="No files uploaded" />
        </Flex>
      )}
      <Dropzone.FullScreen
        active={true}
        accept={fileAcceptance.split(",")}
        onDrop={(selectedFiles) => {
          handleUploadFiles(selectedFiles);
          setFiles([...parseFileObject(selectedFiles), ...files]);
        }}
      >
        <Dropzone.Accept>
          <Flex direction="column" justify="center" align="center">
            <IoIosCloudUpload size={48} />
            <Title order={5}>Drop files here</Title>
          </Flex>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Flex direction="column" justify="center" align="center">
            <IoMdClose size={48} />
            <Title order={5}>File type not supported</Title>
          </Flex>
        </Dropzone.Reject>
      </Dropzone.FullScreen>
    </Flex>
  );
}
