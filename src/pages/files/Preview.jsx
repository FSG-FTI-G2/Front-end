import { Badge, Blockquote, Button, Flex, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdTime } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { getColorByFileType } from "../../utils/utilities";
import PDFPreview from "./PDFPreview";
import DOCXPreview from "./DOCXPreview";

export default function FilePreview() {
  const location = useLocation();
  const navigator = useNavigate();
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
        <Flex align="center">
          <Title order={2}>File Preview</Title>
          <Badge
            color={getColorByFileType("pdf")}
            variant="filled"
            radius="xl"
            ml="md"
          >
            pdf
          </Badge>
        </Flex>
        <Blockquote w="100%" p="md" color={getColorByFileType("pdf")}>
          Some file summary here
        </Blockquote>
        <Flex align="center" gap="md">
          <IoMdTime />
          Uploaded at 10/11/2024, 2:55:07 PM
        </Flex>
        <Flex align="center" gap="md">
          <FaUser />
          By Admin
        </Flex>
      </Flex>
      <Flex flex={7} bg="black">
        {/* <PDFPreview url={"https://www.orimi.com/pdf-test.pdf"} /> */}
        <DOCXPreview
          url={
            "http://writing.engr.psu.edu/workbooks/formal_report_template.doc"
          }
        />
      </Flex>
    </Flex>
  );
}
