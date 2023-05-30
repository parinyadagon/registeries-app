import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { fetchWithMethod } from "@/hooks";
import type { Event } from "@/hooks/types/Event";
import dayjs from "@/lib/dayjs";
import { useTitle } from "@/hooks";

import {
  Container,
  Grid,
  Card,
  Text,
  Image,
  AspectRatio,
  Group,
  Flex,
  TypographyStylesProvider,
  Button,
} from "@mantine/core";
import { IconCalendar, IconClock } from "@tabler/icons-react";

export default function EventDetails() {
  const router = useRouter();
  const [event, setEvent] = useState<Event>();

  function fetchEventById() {
    fetchWithMethod<{
      message: string;
      status: string;
      data: Event;
    }>(`/api/event/${router.query.id}`, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data !== null) {
          setEvent(response.data.data);
        }
      }
    });
  }

  useEffect(fetchEventById, [router.query.id]);
  useTitle(event?.name || "Event Details");

  type convertDateProp = string | Date | undefined;
  function convertDate(date: convertDateProp) {
    return dayjs(date).format("DD MMM BBBB");
  }

  function convertTime(time: convertDateProp) {
    return dayjs(time).format("HH:mm");
  }

  function handleRegister() {}

  return (
    <Container size="md">
      <Grid>
        <Grid.Col span={12}>
          <Card>
            <Card.Section>
              <AspectRatio ratio={21 / 9}>
                <Image src={`/uploads/${event?.image}`} alt="gg" />
              </AspectRatio>
            </Card.Section>

            <Group position="apart" p="10px">
              <Flex justify="center" direction="column" gap={2}>
                <Flex justify="start">
                  <Text
                    fz={{
                      xs: "md",
                      sm: "lg",
                      md: "26px",
                    }}
                    fw="bold">
                    {event?.name}
                  </Text>
                </Flex>
                <Flex justify="start" align="center" gap="sm">
                  <IconCalendar size={20} />
                  <Text>
                    {convertDate(event?.period_start)}
                    {" - "}
                    {convertDate(event?.period_end)}
                  </Text>
                </Flex>
                <Flex justify="start" align="center" gap="sm">
                  <IconClock size={20} />
                  <Text>
                    {convertTime(event?.period_start)}
                    {" - "}
                    {convertTime(event?.period_end)}
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="row" justify="center">
                <Button
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}>
                  Register
                </Button>
              </Flex>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={12}>
          <Card>
            <Text fz="lg" fw="bold">
              Description
            </Text>
            <TypographyStylesProvider>
              <Text
                dangerouslySetInnerHTML={{ __html: event?.description || "" }}
              />
            </TypographyStylesProvider>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
