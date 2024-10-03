import {
  Avatar,
  Burger,
  Drawer,
  Flex,
  NavLink,
  Menu,
  Skeleton,
  Title,
} from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { containerStyle } from "../styles/containerStyle";
import { appColors } from "../../utils/constants";
import { useDisclosure } from "@mantine/hooks";
import { routes } from "../../routes/route";
import { getCurrentUser, logout } from "../../apis/auth";
import useGlobalStore from "../../context/global";
import { useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";

export default function GeneralLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigator = useNavigate();
  const dashboardRoutes = routes.filter(
    (route) => route.path == "/dashboard"
  )[0].children;
  const appTitle = useGlobalStore((state) => state.appTitle);
  const user = useGlobalStore((state) => state.user);
  const setUser = useGlobalStore((state) => state.setUser);

  function handleLogout() {
    logout();
    navigator("/login");
  }

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
    <Flex direction="column" h="100%" bg={appColors.backBackground}>
      <Flex px={10} pt={10}>
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
            {user ? (
              <Menu width={200} position="bottom-end">
                <Menu.Target>
                  <Avatar>{user.username.slice(0, 2)}</Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <Title order={5}>{user.name || user.username}</Title>
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<IoIosLogOut />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Skeleton height={38} width={38} radius="xl" />
            )}
          </Flex>
          <Drawer
            size={250}
            offset={8}
            radius="lg"
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
      <Flex p={10} gap={10} flex={1} h="calc(100% - 74px)">
        <Outlet />
      </Flex>
    </Flex>
  );
}
