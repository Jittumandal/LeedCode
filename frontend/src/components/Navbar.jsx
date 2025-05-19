import { useState } from "react";
import {
  IconChevronDown,
  IconLogout,
  IconUserCircle,
  IconSettings,
  IconBrandProducthunt,
  IconSwitchHorizontal,
  IconCode,
} from "@tabler/icons-react";
import cx from "clsx";
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./HeaderTabs.module.css";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import Logo from "../assets/logo.svg";

export default function Navbar() {
  const { authUser } = useAuthStore();
  console.log("authUser", authUser);

  const avatarImg = "https://avatar.iran.liara.run/public/boy";

  // const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="lg">
        <Group justify="space-between">
          <Link to="/" className={classes.logo}>
            <img src={Logo} alt="logo" /> djustCode
          </Link>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  <Avatar
                    src={authUser?.image || avatarImg}
                    alt={Avatar}
                    radius="xl"
                    size={30}
                  />

                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {authUser?.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconCode size={16} stroke={1.5} />}>
                Codessnippet
              </Menu.Item>
              <Menu.Item
                leftSection={<IconUserCircle size={16} stroke={1.5} />}
              >
                <Link to="/profile"> My Profile</Link>
              </Menu.Item>
              {/*check if the user is admin then show the add problems*/}

              {authUser?.role === "ADMIN" && (
                <Menu.Item
                  leftSection={<IconBrandProducthunt size={16} stroke={1.5} />}
                >
                  <Link to="/addproblem"> Add Problems </Link>
                </Menu.Item>
              )}
              <Menu.Label>Settings</Menu.Label>
              <Menu.Divider />
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Account settings
              </Menu.Item>
              <Menu.Item
                leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}
              >
                Change account
              </Menu.Item>
              <Menu.Divider />
              <LogoutBtn>
                <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>
                  Logout
                </Menu.Item>
              </LogoutBtn>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </div>
  );
}
