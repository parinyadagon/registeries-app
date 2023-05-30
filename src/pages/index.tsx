import { fetchWithMethod, useTitle } from "@/hooks";
import { useEffectOnce } from "@/hooks/index";
import { useState } from "react";
import type { Event } from "@/hooks/types/Event";
import dayjs from "@/lib/dayjs";

import { useRouter } from "next/router";

// Mantine
import { SimpleGrid, Container } from "@mantine/core";

// Components
import CardEvent from "@/components/card/CardEvent";

export default function Home() {
  useTitle("Home");
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);

  useEffectOnce(() => {
    fetchWithMethod<{
      message: string;
      status: string;
      data: Event[];
    }>("/api/event/listForUser", "GET").then((response) => {
      if (response.status === 200) {
        if (response.data !== null) {
          setEvents(response.data.data);
        }
      }
    });
  });

  const convertDate = (date: string | Date) => {
    return dayjs(date).format("DD MMM BBBB");
  };

  const convertTime = (time: string | Date) => {
    return dayjs(time).format("HH:mm");
  };

  const handleClickJoin = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  return (
    <>
      <Container size="xl">
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: "sm", cols: 1, spacing: "md" },
            { maxWidth: "md", cols: 2, spacing: "md" },
            { maxWidth: "lg", cols: 3, spacing: "md" },
          ]}>
          {events.map((event, index) => (
            <CardEvent
              onClick={() => handleClickJoin(event)}
              image={`/uploads/${event.image}`}
              title={event.name}
              date={`
              ${convertDate(event.period_start)} - 
              ${convertDate(event.period_end)}
              `}
              time={`
              ${convertTime(event.period_start)} - 
              ${convertTime(event.period_end)}
              `}
              location="location"
              key={index}
            />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
