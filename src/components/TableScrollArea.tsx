import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Center,
  Flex,
  Text,
} from "@mantine/core";

// type
import { listUser } from "@/hooks/types/Overview";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface TableScrollAreaProps {
  data: listUser[];
}

export default function TableScrollArea({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row) => (
    <tr key={row.name}>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.status}</td>
      <td>{row.code}</td>
    </tr>
  ));

  return (
    <ScrollArea
      h="77vh"
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>ชื่อ</th>
            <th>อีเมล</th>
            <th>สถานะ</th>
            <th>รหัสยืนยัน</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
