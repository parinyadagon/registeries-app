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
  Box,
} from "@mantine/core";
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function EventDetails() {
  const router = useRouter();
  const [event, setEvent] = useState<Event>();
  const [opened, { open, close }] = useDisclosure(false);

  const [
    stateDialogDetail,
    { open: openDialogDetail, close: closeDialogDetail },
  ] = useDisclosure(false);

  const [messageRegisterComplete, setMessageRegisterComplete] =
    useState<string>("");

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
        console.log("response", response);
        if (response.data !== null) {
          openDialogDetail();
          setMessageRegisterComplete(response.data.message);
        }
      }
    );
  }

  return (
    <Container
      sx={{
        "@media (max-width: 30em)": {
          padding: "0",
        },
      }}
      size="md">
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

            <Flex
              justify="space-between"
              direction={{ base: "column", md: "row" }}
              pt="10px">
              <Box>
                <Flex justify="start">
                  <Text
                    fz={{
                      base: "1.5rem",
                      sm: "1.8rem",
                      md: "2rem",
                    }}
                    fw="bold">
                    {event?.name}
                  </Text>
                </Flex>
                {event?.period_start && (
                  <Flex justify="start" align="center" gap="sm">
                    <IconCalendar size={20} />
                    <Text>
                      {convertDate(event?.period_start)}
                      {" - "}
                      {convertDate(event?.period_end)}
                    </Text>
                  </Flex>
                )}
                {event?.period_start && (
                  <Flex justify="start" align="center" gap="sm">
                    <IconClock size={20} />
                    <Text>
                      {convertTime(event?.period_start)}
                      {" - "}
                      {convertTime(event?.period_end)}
                    </Text>
                  </Flex>
                )}
                {event?.location && (
                  <Flex justify="start" align="center" gap="sm">
                    <IconMapPin size={20} />
                    <Text>{event?.location}</Text>
                  </Flex>
                )}
              </Box>
              <Box
                sx={{
                  alignSelf: "flex-end",
                }}>
                <Flex direction="row" justify="flex-end">
                  <Button
                    variant="gradient"
                    onClick={handleOpenDialog}
                    gradient={{ from: "indigo", to: "cyan" }}>
                    ลงทะเบียน
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </Grid.Col>
        <Grid.Col span={12}>
          <Card>
            <Text
              fz={{ base: "1.2em", sm: "1.4em", md: "1.6em" }}
              fw="bold"
              color="blue">
              รายละเอียด
            </Text>
            <TypographyStylesProvider>
              <Text
                dangerouslySetInnerHTML={{ __html: event?.description || "" }}
              />
            </TypographyStylesProvider>
          </Card>
        </Grid.Col>
      </Grid>
      <DialogRegister opened={opened} close={close} onSubmit={handleRegister} />
      <DialogDetail
        opened={stateDialogDetail}
        close={closeDialogDetail}
        message={messageRegisterComplete}
      />
    </Container>
  );
}

interface DialogRegisterProps {
  opened: boolean;
  close: () => void;
  onSubmit: (regisData: RegisterData) => void;
}

function DialogRegister({ opened, close, onSubmit }: DialogRegisterProps) {
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
          withAsterisk
          {...form.getInputProps("name")}
        />
        <TextInput
          label="อีเมล"
          placeholder="your@mail.com"
          mt="md"
          withAsterisk
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

type DialogDetailProps = {
  opened: boolean;
  close: () => void;
  message: string;
};

function DialogDetail({ opened, close, message }: DialogDetailProps) {
  return (
    <Modal opened={opened} onClose={close} withCloseButton={false}>
      <Text align="center" fz={{ base: "1.4rem", lg: "1.2rem" }} my={30}>
        {message}
      </Text>
      <Flex direction="row" justify="center">
        <Button
          size="sm"
          radius="xl"
          sx={{
            width: "10rem",
          }}
          onClick={() => close()}>
          ปิด
        </Button>
      </Flex>
    </Modal>
  );
}
