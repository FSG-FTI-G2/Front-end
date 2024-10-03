import {
  Button,
  Checkbox,
  FileButton,
  Flex,
  Grid,
  Input,
  Loader,
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
import { useState } from "react";
import FileCard from "../../components/FileCard";
import Empty from "../../components/Empty";
import { Dropzone } from "@mantine/dropzone";

const mockFiles = [
  {
    fileName: "SaoKeTuThien",
    fileType: "pdf",
    uploadedDate: "2021-09-01",
    status: "processing",
  },
  {
    fileName: "SaoKeTuThien",
    fileType: "docx",
    uploadedDate: "2021-09-01",
    status: "success",
  },
  {
    fileName: "SaoKeTuThien",
    fileType: "txt",
    uploadedDate: "2021-09-01",
    status: "error",
  },
];

export default function UploadFileSection() {
  const [fileLoading, setFileLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState([]);
  const [fileStatusFilter, setFileStatusFilter] = useState([]);

  return (
    <Flex direction="column" h="100%">
      <Flex p="md" justify="space-between">
        <FileButton
          leftSection={<IoIosCloudUpload />}
          radius="xl"
          accept={fileAcceptance}
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
            leftSection={isSearching ? <Loader size="xs" /> : <IoIosSearch />}
          />
        </Flex>
      </Flex>
      {fileLoading ? (
        <ScrollArea px="md" h="100%" scrollbars="y">
          <Grid w="100%" breakpoints={gridBreakpoints}>
            {[1, 2, 3].map((index) => (
              <Grid.Col key={index} span={gridSpan}>
                <Skeleton height={200} radius="md" />
              </Grid.Col>
            ))}
          </Grid>
        </ScrollArea>
      ) : mockFiles?.length ? (
        <ScrollArea px="md" h="100%" scrollbars="y">
          <Grid w="100%" breakpoints={gridBreakpoints}>
            {mockFiles.map((file, index) => (
              <Grid.Col key={index} span={gridSpan}>
                <FileCard
                  fileName={file.fileName}
                  fileType={file.fileType}
                  uploadedDate={file.uploadedDate}
                  status={file.status}
                  thumbnail=""
                />
              </Grid.Col>
            ))}
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
        onDrop={(files) => console.log(files)}
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
