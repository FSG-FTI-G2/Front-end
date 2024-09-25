import GeneralLayout from "../components/layout/GeneralLayout";
import Section from "../components/layout/Section";
// Icons
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";

export const routes = [
  {
    path: "/",
    element: <div>Landing Page</div>,
  },
  {
    path: "/login",
    element: <div>Login Page</div>,
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
              <div>Document</div>
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
    path: "*",
    element: <div>404 Page</div>,
  },
];
