import { fetchWithMethod, useTitle } from "@/hooks";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import generateQrcode from "@/lib/qrcdoe";

// mantine
import {
  Grid,
  Box,
  Text,
  Paper,
  ScrollArea,
  Flex,
  Image,
  Center,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

// type
import { Event } from "@/hooks/types/Event";
import { Overview, listUser } from "@/hooks/types/Overview";

// component card
import CardEvent from "@/components/card/CardEvent";
import TableScrollArea from "@/components/TableScrollArea";

// dayjs
import dayjs from "@/lib/dayjs";
import StatsSegments from "@/components/StatsSegments";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useTitle("Dashboard");

  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Overview>();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [progress, setProgress] = useState<
    {
      label: string;
      color: string;
      count: string;
      tooltip: string;
      part: number;
    }[]
  >([]);
  const [dataTable, setDataTable] = useState<listUser[]>([]);
  const [qrcode, setQrcode] = useState<string>("");

  const email: string = useMemo(
    () => session?.user?.email || "",
    [session?.user?.email]
  );

  function fetchEvents() {
    if (email === "") return;
    fetchWithMethod<{
      message: string;
      status: string;
      data: Event[];
    }>("/api/event/list", "POST", { email: email }).then((response) => {
      if (response.status === 200) {
        if (response.data !== null) {
          setEvents(response.data.data);
        }
      }
    });
  }

  function fetchEventById(eventId: string) {
    fetchWithMethod<{
      message: string;
      status: string;
      data: Overview;
    }>(`/api/event/${eventId}/overview`, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data !== null) {
          setEvent(response.data.data);
          setDataTable(response.data.data.listUsers);
          setProgress([
            {
              label: "เข้าร่วม",
              count: response.data.data.userAttend.toString(),
              color: "#32CD32",
              tooltip: `เข้าร่วม ${response.data.data.userAttend.toString()} คน`,
              part:
                (response.data.data.userAttend /
                  response.data.data.listUsers.length) *
                  100 || 0,
            },
            {
              label: "ไม่ได้เข้าร่วม",
              count: response.data.data.userNotAttend.toString(),
              color: "#FF6347",
              tooltip: `ไม่ได้เข้าร่วม ${response.data.data.userNotAttend.toString()} คน`,
              part:
                (response.data.data.userNotAttend /
                  response.data.data.listUsers.length) *
                  100 || 0,
            },
          ]);
        }
      }
    });
  }

  useEffect(fetchEvents, [email]);

  const convertDate = (date: string | Date) => {
    return dayjs(date).format("DD MMM BBBB");
  };

  const convertTime = (time: string | Date) => {
    return dayjs(time).format("HH:mm");
  };

  type RequireEvent = Required<Event>;
  async function handleClickEvent(event: RequireEvent) {
    fetchEventById(event.id);
    setSelectedEvent(event.id);
    setQrcode(await generateQrcode(event.id));
  }

  if (status === "unauthenticated") {
    return <>Access Denied</>;
  }

  return (
    <>
      <Grid mx="auto" gutter="md">
        <Grid.Col span={12}>
          <Text fz={{ base: "1.9rem" }} fw="bold">
            Overview
          </Text>
        </Grid.Col>
        <Grid.Col xs={12} xl={2}>
          <Paper p="10px" radius="md" withBorder>
            <ScrollArea h={{ base: "auto", xl: "80vh" }}>
              <Flex
                align="stretch"
                justify="flex-start"
                direction={{ base: "row", xl: "column" }}
                gap={20}>
                {events.map((event, index) => (
                  <Box key={index} miw={{ base: "300px", xl: "200px" }}>
                    <CardEvent
                      onClick={() => handleClickEvent(event as RequireEvent)}
                      image={`/uploads/${event.image}`}
                      title={event.name}
                      bg={event.id === selectedEvent ? "blue" : ""}
                      key={index}
                    />
                  </Box>
                ))}
              </Flex>
            </ScrollArea>
          </Paper>
        </Grid.Col>
        {event ? (
          <>
            <Grid.Col xs={12} xl={3}>
              <Flex direction="column" gap={20}>
                <StatsSegments
                  total={`${event?.listUsers.length} คน`}
                  data={progress}
                />
                <Paper p="10px" radius="md" withBorder>
                  <Image
                    maw={350}
                    mx="auto"
                    radius="md"
                    src={qrcode}
                    alt="Random image"
                  />
                </Paper>
              </Flex>
            </Grid.Col>
            <Grid.Col xs={12} xl={7}>
              <Paper p="10px" radius="md" withBorder>
                <Text>รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม</Text>
                <TableScrollArea data={dataTable} />
              </Paper>
            </Grid.Col>
          </>
        ) : (
          <>
            <Grid.Col xs={12} lg={10}>
              <Center h="80vh" mx="auto">
                <Text fz="1.6rem">เลือกกิจกรรมเพื่อดูรายละเอียด</Text>
              </Center>
            </Grid.Col>
          </>
        )}
      </Grid>
    </>
  );
}
