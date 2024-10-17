import { Fragment, useEffect, useState } from "react";
import {
  Badge,
  Blockquote,
  Button,
  Center,
  Flex,
  Skeleton,
  Title,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IoMdArrowRoundBack, IoMdTime } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import {
  formatDateString,
  formatLongFileName,
  getColorByFileType,
  getFileStaticPath,
} from "../../utils/utilities";
import PDFPreview from "./PDFPreview";
import DOCXPreview from "./DOCXPreview";
import TXTPreview from "./TXTPreview";
import { getFileById } from "../../apis/files";

/**
 * @param {{
 * fileType: string
 * url: string
 * }} props
 * @returns {JSX.Element}
 */
const GetPreviewByType = ({ fileType, url }) => {
  if (fileType === "pdf") {
    return <PDFPreview url={url} />;
  } else if (fileType === "docx") {
    return <DOCXPreview url={url} />;
  } else if (fileType === "txt") {
    return <TXTPreview url={url} />;
  } else {
    return (
      <Center h="100%" w="100%">
        <Title order={3}>Preview not available</Title>
      </Center>
    );
  }
};

export default function FilePreview() {
  const location = useLocation();
  const navigator = useNavigate();
  const [loading, setLoading] = useState(true);
  /** @type {[FileData, (data: FileData) => void]} */
  const [file, setFile] = useState(null);

  useEffect(() => {
    const id = location.pathname.split("/")[2];
    getFileById({
      id,
      onSuccess: (data) => {
        setLoading(false);
        setFile(data);
      },
      onFail: (message) => {
        notifications.show({
          title: "Error",
          message,
          color: "red",
        });
      },
    });
  }, []);

  return (
    <Flex w="100vw" h="100vh">
      <Flex flex={3} p="md" direction="column" align="start" gap="md">
        <Button
          variant="transparent"
          leftSection={<IoMdArrowRoundBack />}
          onClick={() => navigator("/dashboard")}
        >
          Dashboard
        </Button>
        {!file && loading ? (
          <Fragment>
            <Skeleton height={40} width="80%" />
            <Skeleton height={20} width="60%" />
            <Skeleton height={20} width="60%" />
          </Fragment>
        ) : (
          <Fragment>
            <Flex align="center">
              <Title order={2}>{formatLongFileName(file.file_name)}</Title>
              <Badge
                color={getColorByFileType(file.type)}
                variant="filled"
                radius="xl"
                ml="md"
                autoContrast
              >
                {file.type}
              </Badge>
            </Flex>
            {file.summary && (
              <Blockquote w="100%" p="md" color={getColorByFileType(file.type)}>
                Some file summary here
              </Blockquote>
            )}
            <Flex align="center" gap="md">
              <IoMdTime />
              Uploaded at {formatDateString(file.created_at)}
            </Flex>
            <Flex align="center" gap="md">
              <FaUser />
              By Admin
            </Flex>
          </Fragment>
        )}
      </Flex>
      <Flex flex={7}>
        {!file ? (
          <Skeleton h="100%" w="100%" />
        ) : (
          <GetPreviewByType
            fileType={file.type}
            url={getFileStaticPath(file.file_path)}
          />
        )}
      </Flex>
    </Flex>
  );
}
