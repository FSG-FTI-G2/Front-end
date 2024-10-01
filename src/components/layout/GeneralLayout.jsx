import { Avatar, Burger, Drawer, Flex, NavLink, Title } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { containerStyle } from "../styles/containerStyle";
import { appColors } from "../../utils/constants";
import { useDisclosure } from "@mantine/hooks";
import { routes } from "../../routes/route";
import { getCurrentUser } from "../../apis/auth";
import useGlobalStore from "../../context/global";

export default function GeneralLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigator = useNavigate();
  const dashboardRoutes = routes.filter(
    (route) => route.path == "/dashboard"
  )[0].children;
  const appTitle = useGlobalStore((state) => state.appTitle);
  const setUser = useGlobalStore((state) => state.setUser);

  useEffect(() => {
    getCurrentUser({
      onSuccess: (user) => {
        setUser(user);
      },
      onFail: () => {
        navigator("/login");
      },
    });
  }, []);

  return (
    <Flex direction="column" h="100vh" bg={appColors.backBackground}>
      <Flex px={20} pt={20}>
        <Flex
          w="100%"
          px={25}
          h={64}
          align="center"
          style={{
            ...containerStyle,
          }}
          justify="space-between"
        >
          <Flex gap={16}>
            <Burger size="sm" opened={opened} onClick={toggle} />
            <Title order={4}>{appTitle}</Title>
          </Flex>
          <Flex gap={16}>
            <Avatar>Ad</Avatar>
          </Flex>
          <Drawer
            size={250}
            offset={8}
            radius="md"
            opened={opened}
            onClose={close}
          >
            {dashboardRoutes.map((route) => (
              <NavLink
                key={route.path}
                label={route.label}
                leftSection={route.icon}
                active={location.pathname == route.path}
                onClick={() => {
                  navigator(route.path);
                  close();
                }}
              />
            ))}
          </Drawer>
        </Flex>
      </Flex>
      <Flex p={20} gap={20} flex={1} h="100%">
        <Outlet />
      </Flex>
    </Flex>
  );
}
