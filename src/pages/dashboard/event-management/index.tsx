import { useEffectOnce, useTitle } from "@/hooks";
import { useSession } from "next-auth/react";

import { useState } from "react";

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

  useEffectOnce(() => {
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
  });

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
            <Modal
              opened={opened}
              onClose={close}
              fullScreen
              title="Create Event">
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
                    <DateTimePicker
                      label="Period start"
                      placeholder="Pick date and time"
                      valueFormat="DD MMM YYYY hh:mm A"
                      maw={400}
                      mx="auto"
                      {...form.getInputProps("period_start")}
                    />
                    <DateTimePicker
                      label="Period end"
                      placeholder="Pick date and time"
                      valueFormat="DD MMM YYYY hh:mm A"
                      maw={400}
                      mx="auto"
                      {...form.getInputProps("period_end")}
                    />
                    <NumberInput
                      label="Limit user"
                      placeholder="Limit user"
                      withAsterisk
                      mt="md"
                      {...form.getInputProps("limit_user")}
                    />

                    <Group position="right" mt="md">
                      <Button onClick={() => handleClickSubmit("DRAFT")}>
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
          <Grid justify="space-evenly">
            {["1", "2", "3", "4"].map((event, index) => (
              <Grid.Col key={index} xs={12} sm={5} md={2}>
                <ArticleCardImage
                  title={event}
                  category="run"
                  image="https://picsum.photos/200/300"
                  key={index}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </>
  );
}
