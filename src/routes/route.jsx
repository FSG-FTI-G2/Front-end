import GeneralLayout from "../components/layout/GeneralLayout";
import Section from "../components/layout/Section";
// Icons
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";
import  TornadoEffect  from "../pages/landingPage/threejsLP"
import { CiViewTable } from "react-icons/ci";
import LoginLayout from "../pages/Login";
import UploadFileSection from "../pages/Chat/UploadFile";
import FilePreview from "../pages/File/Preview";
import ChatBoxSection from "../pages/Chat/ChatBox";
import FeedbackTable from "../pages/Feedback/FeedbackTable";

export const routes = [
  {
    path: "/",
    element: <TornadoEffect/>,
  },
  {
    path: "/login",
    element: <LoginLayout />,
  },
  {
    path: "/dashboard",
    element: <GeneralLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <>
            <Section>
              <UploadFileSection />
            </Section>
            <Section>
              <ChatBoxSection />
            </Section>
          </>
        ),
        label: "Chat with AI",
        icon: <IoChatboxEllipsesOutline />,
      },
      {
        path: "/dashboard/human-feedback",
        element: (
          <Section>
            <FeedbackTable />
          </Section>
        ),
        label: "Human Feeback",
        icon: <CiViewTable />,
      },
      {
        path: "/dashboard/fine-tune",
        element: (
          <Section>
            <div>Fine Tune AI</div>
          </Section>
        ),
        label: "Fine-tune",
        icon: <FaBrain />,
      },
    ],
  },
  {
    path: "/file/:id",
    element: <FilePreview />,
  },
  {
    path: "*",
    element: <div>404 Page</div>,
  },
];
