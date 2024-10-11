import GeneralLayout from "../components/layout/GeneralLayout";
import Section from "../components/layout/Section";
// Icons
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";
import LoginLayout from "../pages/loginPage";
import UploadFileSection from "../pages/chatPage/UploadFile";
import FilePreview from "../pages/files/Preview";

export const routes = [
  {
    path: "/",
    element: <div>Landing Page</div>,
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
              <div>Chat with AI</div>
            </Section>
          </>
        ),
        label: "Chat with AI",
        icon: <IoChatboxEllipsesOutline />,
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
