import { useEffectOnce, useTitle } from "@/hooks";
import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

// Mantine
import { useForm, isNotEmpty } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  NumberInput,
  Box,
  Paper,
  Grid,
  Title,
  Modal,
  Flex,
  Card,
  SimpleGrid,
  Text,
  Badge,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconCheck, IconX, IconPlus } from "@tabler/icons-react";
import { Notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

// Hooks
import { fetchWithMethod } from "@/hooks";

// Components
import { ArticleCardImage } from "@/components/CardWithBgImage";

// Types
import { Event } from "@/hooks/types/Event";

export default function CreatePage() {
  useTitle("Event Management");
  const { data: session } = useSession();
  const email: string = session?.user?.email || "";

  const [opened, { open, close }] = useDisclosure(false);

  const [events, setEvents] = useState<Event[]>([]);

  useEffectOnce(() => {
    return () => {
      Notifications.clean();
    };
  });

  useEffect(() => {
    fetchWithMethod<{
      message: string;
      status: string;
      data: Event[];
    }>("/api/event/list", "POST", { email: email }).then((response) => {
      if (response.status === 200) {
        if (response.data !== null) {
          setEvents(response.data.data);
        }
      } else {
        Notifications.show({
          title: "Error",
          message: "Try again later",
          autoClose: true,
          color: "red",
          icon: <IconX />,
        });
      }
    });
  }, [email]);

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

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      limit_user: 18,
      period_start: "",
      period_end: "",
      status: "",
      email: "",
    },

    validate: {
      name: isNotEmpty(),
      description: isNotEmpty(),
      limit_user: isNotEmpty(),
      period_start: isNotEmpty(),
      period_end: isNotEmpty(),
    },
  });

  const handleClickSubmit = async (save_type: string) => {
    if (!form.validate().hasErrors) {
      form.setFieldValue("email", email);
      if (save_type === "PUBLISHED") {
        form.setFieldValue("status", "PUBLISHED");
      } else {
        form.setFieldValue("status", "DRAFT");
      }

      const response = await fetchWithMethod(
        "/api/event/create",
        "POST",
        form.values
      );

      if (response.status === 200) {
        close();
        form.reset();
        Notifications.show({
          title: "Success",
          message: "Event created",
          autoClose: true,
          color: "green",
          icon: <IconCheck />,
        });
      } else {
        Notifications.show({
          title: "Error",
          message: "Try again later",
          autoClose: true,
          color: "red",
          icon: <IconX />,
        });
      }
    }
  };

  return (
    <>
      <Grid>
        <Grid.Col xs={12}>
          <Flex justify="start" align="center" direction="row" gap="md">
            <Title order={1}>Event Management</Title>
            <Button onClick={open} rightIcon={<IconPlus size="1rem" />}>
              Event
            </Button>
            <Modal opened={opened} onClose={close} withCloseButton={false}>
              <Notifications />
              <Grid>
                <Grid.Col xs={12}>
                  <Box component="form" maw={400} mx="auto">
                    <TextInput
                      label="Name"
                      placeholder="Name"
                      withAsterisk
                      {...form.getInputProps("name")}
                    />
                    <TextInput
                      label="Description"
                      placeholder="Description"
                      withAsterisk
                      mt="md"
                      {...form.getInputProps("description")}
                    />
                    <Flex justify="space-between">
                      <DateTimePicker
                        label="Period start"
                        placeholder="Pick date and time"
                        valueFormat="DD MMM YYYY hh:mm A"
                        maw={400}
                        dropdownType="modal"
                        {...form.getInputProps("period_start")}
                      />
                      <DateTimePicker
                        label="Period end"
                        placeholder="Pick date and time"
                        valueFormat="DD MMM YYYY hh:mm A"
                        maw={400}
                        dropdownType="modal"
                        {...form.getInputProps("period_end")}
                      />
                    </Flex>
                    <NumberInput
                      label="Limit user"
                      placeholder="Limit user"
                      withAsterisk
                      mt="md"
                      {...form.getInputProps("limit_user")}
                    />

                    <Group position="right" mt="md">
                      <Button
                        bg="gray"
                        sx={{
                          ":hover": {
                            backgroundColor: "#bfbfbf",
                          },
                        }}
                        onClick={() => handleClickSubmit("DRAFT")}>
                        DRAFT
                      </Button>
                      <Button onClick={() => handleClickSubmit("PUBLISHED")}>
                        PUBLISH
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>
              </Grid>
            </Modal>
          </Flex>
        </Grid.Col>
        <Grid.Col xs={12}>
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              { maxWidth: "62rem", cols: 3, spacing: "md" },
              { maxWidth: "48rem", cols: 2, spacing: "sm" },
              { maxWidth: "36rem", cols: 1, spacing: "sm" },
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
                <Badge
                  sx={{
                    position: "absolute",
                    bottom: 15,
                    right: 15,
                  }}>
                  {event.status}
                </Badge>
                <Title>{event.name}</Title>
                <Text fz="md" lineClamp={4}>
                  {event.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </>
  );
}
