import React, { useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  getStylesRef,
  rem,
  Button,
} from "@mantine/core";
import { IconGauge, IconLogout } from "@tabler/icons-react";

import { LinksGroup } from "./NavbarLinksGroup";

import { UserButton } from "../UserButton";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const mockdata = [
  {
    label: "Dashboard",
    icon: IconGauge,
    initiallyOpened: true,
    links: [
      { label: "ภาพรวม", link: "/dashboard" },
      { label: "จัดการกิจกรรม", link: "/dashboard/event-management" },
    ],
  },
];

type NavbarCoreProps = {
  width: object;
  p: string;
  hiddenBreakpoint: string;
  hidden: boolean;
  logOut?: () => void;
  username?: string;
  avatar?: string;
  email?: string;
};

export default function NavbarCore({
  logOut,
  username,
  avatar,
  email,
  ...other
}: NavbarCoreProps) {
  const { classes, cx } = useStyles();

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const handlerClickLogOut = () => {
    if (logOut) {
      logOut();
    }
  };

  return (
    <Navbar {...other}>
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <UserButton name={username} image={avatar} email={email} />
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Button
          leftIcon={<IconLogout className={classes.linkIcon} stroke={1.5} />}
          variant="white"
          className={classes.link}
          fullWidth
          h={44}
          onClick={handlerClickLogOut}>
          <span>Logout</span>
        </Button>
      </Navbar.Section>
    </Navbar>
  );
}
