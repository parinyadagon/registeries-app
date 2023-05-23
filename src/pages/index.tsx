import { fetchWithMethod, useTitle } from "@/hooks";
import { useEffectOnce } from "@/hooks/index";
import { useState } from "react";
import type { Event } from "@/hooks/types/Event";

// Mantine
import {
  SimpleGrid,
  Card,
  Title,
  Text,
  Button,
  Badge,
  Container,
} from "@mantine/core";

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

  const colorGradient = [
    { from: "#696eff", to: "#f8acff", deg: 20 },
    { from: "#439cfb", to: "#f187fb", deg: 20 },
    { from: "#b597f6", to: "#96c6ea", deg: 20 },
    { from: "#7c65a9", to: "#96d4ca", deg: 20 },
    { from: "#d397fa", to: "#8364e8", deg: 20 },
    { from: "#82f4b1", to: "#30c67c", deg: 20 },
    { from: "#a8f368", to: "#9946b2", deg: 20 },
    { from: "#e9d022", to: "#e60b09", deg: 20 },
    { from: "#f3696e", to: "#f8a902", deg: 20 },
    { from: "#6274e7", to: "#8752a3", deg: 20 },
  ];

  const randomGradient = () => colorGradient[Math.floor(Math.random() * 10)];

  return (
    <>
      <Container size="xl" px="xs">
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: "sm", cols: 1, spacing: "md" },
            { maxWidth: "md", cols: 3, spacing: "md" },
            { maxWidth: "lg", cols: 4, spacing: "md" },
          ]}>
          {events.map((event, index) => (
            <Card
              key={index}
              shadow="lg"
              padding="sm"
              h={200}
              sx={(theme) => ({
                borderRadius: 15,
                backgroundImage: theme.fn.gradient(randomGradient()),
                position: "relative",
              })}>
              <Title order={3}>{event.name}</Title>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
