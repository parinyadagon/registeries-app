import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchWithMethod } from "@/hooks";
import type { Event, RegisterData } from "@/hooks/types/Event";
import dayjs from "@/lib/dayjs";
import { useTitle } from "@/hooks";

import { useForm } from "@mantine/form";

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
  Modal,
  TextInput,
} from "@mantine/core";
import { IconCalendar, IconClock } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function EventDetails() {
  const router = useRouter();
  const [event, setEvent] = useState<Event>();
  const [opened, { open, close }] = useDisclosure(false);

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

  function handleOpenDialog() {
    open();
  }

  function handleRegister(regisData: RegisterData) {
    fetchWithMethod<{
      message: string;
      status: string;
    }>(`/api/event/${router.query.id}/register`, "POST", regisData).then(
      (response) => {
        if (response.data !== null) {
          alert(response.data.message);
        }
      }
    );
  }

  return (
    <Container size="md">
      <Grid>
        <Grid.Col span={12}>
          <Card>
            <Card.Section>
              <AspectRatio ratio={21 / 9}>
                {event?.image && (
                  <Image
                    src={`/uploads/${event?.image}`}
                    withPlaceholder
                    alt="gg"
                  />
                )}
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
                  onClick={handleOpenDialog}
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
      <DialogRegister
        event={event}
        opened={opened}
        close={close}
        onSubmit={handleRegister}
      />
    </Container>
  );
}

interface DialogRegisterProps {
  event?: Event;
  opened: boolean;
  close: () => void;
  onSubmit: (regisData: RegisterData) => void;
}

function DialogRegister({
  event,
  opened,
  close,
  onSubmit,
}: DialogRegisterProps) {
  const form = useForm<RegisterData>({
    initialValues: {
      name: "",
      email: "",
    },

    validate: {
      name: (value) => (value ? null : "กรุณากรอกชื่อ-นามสกุล"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "กรุณากรอกอีเมล"),
    },
  });

  function handleCloseDialog() {
    close();
    form.reset();
  }

  function handleSubmit() {
    if (form.validate().hasErrors) return;
    onSubmit(form.values);
    handleCloseDialog();
    form.reset();
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseDialog}
        title="ลงทะเบียน"
        sx={{
          ".mantine-Modal-title": {
            fontFamily: "prompt",
          },
        }}>
        <TextInput
          data-autofocus
          label="ชื่อ-นามสกุล"
          placeholder="กรุณากรอกชื่อ-นามสกุล"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="อีเมล"
          placeholder="your@mail.com"
          mt="md"
          {...form.getInputProps("email")}
        />
        <Flex justify="end" gap={8} mt="sm">
          <Button color="red" variant="outline" onClick={handleCloseDialog}>
            <Text>ยกเลิก</Text>
          </Button>
          <Button onClick={handleSubmit}>
            <Text>บันทึก</Text>
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
