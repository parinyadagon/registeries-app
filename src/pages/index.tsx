import { fetchWithMethod, useTitle } from "@/hooks";
import { useEffectOnce } from "@/hooks/index";
import { useMemo, useState } from "react";
import type { Event } from "@/hooks/types/Event";
import dayjs from "@/lib/dayjs";

// Mantine
import { SimpleGrid, Container } from "@mantine/core";

// Components
import CardEvent from "@/components/card/CardEvent";

export default function Home() {
  useTitle("Home");

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

  const convertDate = (date: string) => {
    return dayjs(date).format("DD MMM BBBB");
  };

  const handleClickJoin = (event: Event) => {
    console.log(event);
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
              image="https://cdn.pixabay.com/photo/2023/05/21/07/47/horse-8008038_1280.jpg"
              title={event.name}
              date={`
              ${convertDate(event.period_start)} - 
              ${convertDate(event.period_end)}
              `}
              location="location"
              time="time"
              key={index}
            />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
