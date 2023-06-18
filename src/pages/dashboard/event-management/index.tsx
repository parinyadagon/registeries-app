import { useEffectOnce, useTitle } from "@/hooks";
import { useSession } from "next-auth/react";

import { useState, useEffect, useMemo } from "react";

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
  TypographyStylesProvider,
  Image,
  ActionIcon,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconCheck,
  IconX,
  IconPlus,
  IconEdit,
  IconChevronsDownLeft,
} from "@tabler/icons-react";
import { Notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { FileWithPath } from "@mantine/dropzone";
import { modals } from "@mantine/modals";

// Hooks
import { fetchWithMethod } from "@/hooks";

// Components
import TextEditor from "@/components/TextEditor";
import UploadImage from "@/components/UploadImage";
import CardEvent from "@/components/card/CardEvent";

// Types
import { Event, EventStatus } from "@/hooks/types/Event";

// Libs
import dayjs from "@/lib/dayjs";
import { IconTrash } from "@tabler/icons-react";

export default function CreatePage() {
  useTitle("Event Management");
  const { data: session } = useSession();
  const email: string = useMemo(
    () => session?.user?.email || "",
    [session?.user?.email]
  );

  const [opened, { open, close }] = useDisclosure(false);

  const [events, setEvents] = useState<Event[]>([]);

  const [content, setContent] = useState<string>(``);
  const [oldContent, setOldContent] = useState<string>("");

  useEffectOnce(() => {
    return () => {
      Notifications.clean();
    };
  });

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
  }

  useEffect(fetchEvents, [email]);

  const form = useForm<Event>({
    initialValues: {
      id: "",
      name: "",
      description: "",
      // limit_user: 18,
      location: "",
      period_start: "",
      period_end: "",
      status: EventStatus.DRAFT,
      email: "",
      image: "",
    },

    validate: {
      name: isNotEmpty(),
      // limit_user: isNotEmpty(),
      location: isNotEmpty(),
      period_start: isNotEmpty(),
      period_end: isNotEmpty(),
    },
  });

  function handleDeleteEvent(eventId: string) {
    fetchWithMethod<{
      status: string;
      message: string;
    }>(`/api/event/${eventId}`, "DELETE").then(() => {
      fetchEvents();
    });
  }

  async function handleClickSubmit(save_type: string) {
    if (!form.validate().hasErrors) {
      form.setFieldValue("email", email);
      // form.setFieldValue("image", imagePath);

      form.setFieldValue("description", content || oldContent);
      const { newImageName } = await uploadToServer();
      if (newImageName) {
        form.setFieldValue("image", newImageName);
      }

      const event = {
        ...form.values,
        ...{
          description: content || oldContent,
          image: newImageName || form.values.image,
          status: save_type || form.values.status,
        },
      };

      const response = await fetchWithMethod(
        "/api/event/create",
        "POST",
        event
      );

      if (response.status === 200) {
        fetchEvents();
      }

      if (response.status === 200) {
        close();
        form.reset();
        Notifications.show({
          title: "Success",
          message: "สร้างกิจกรรมแล้ว",
          autoClose: true,
          color: "green",
          icon: <IconCheck />,
        });
      } else {
        Notifications.show({
          title: "Error",
          message: "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง",
          autoClose: true,
          color: "red",
          icon: <IconX />,
        });
      }
    }
  }

  // Rich Text Editor.

  const handleGetContent = (content: string | undefined) => {
    if (content === undefined) return;
    setContent(content);
  };

  // Image Upload
  const [image, setImage] = useState<FileWithPath[]>();
  const [imagePreview, setImagePreview] = useState<JSX.Element[]>([]);
  const handleGetImage = (
    image: FileWithPath[] | undefined,
    imagePreview: JSX.Element[]
  ) => {
    if (image === undefined) return;
    setImage(image);
    // setImagePreview(imagePreview);
  };

  async function uploadToServer(): Promise<{
    newImageName: string;
    error: string | null;
  }> {
    const formData = new FormData();
    return new Promise(async (resolve, reject) => {
      try {
        if (image === undefined || image.length < 1) {
          return resolve({ newImageName: "", error: null });
        } else {
          for (let file of image) {
            if (file instanceof File) formData.append("file", file);
          }
        }
        const response = await fetch("/api/event/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const { files } = await response.json();
          const newImageName = files.newFilename;

          resolve({ newImageName, error: null });
        } else {
          return resolve({ newImageName: "", error: "Upload failed" });
        }
      } catch (error: any) {
        return resolve({ newImageName: "", error: error });
      }
    });
  }

  // card event

  const convertDate = (date: string | Date) => {
    return dayjs(date).format("DD MMM BBBB");
  };

  const convertTime = (time: string | Date) => {
    return dayjs(time).format("HH:mm");
  };

  // edit event
  function handleClickEditEvent(event: Event) {
    form.setFieldValue("email", email);
    form.setFieldValue("id", event.id);
    form.setFieldValue("name", event.name);
    // form.setFieldValue("limit_user", event.limit_user);
    form.setFieldValue("location", event.location);
    form.setFieldValue("period_start", dayjs(event.period_start).toDate());
    form.setFieldValue("period_end", dayjs(event.period_end).toDate());
    form.setFieldValue("status", event.status);
    form.setFieldValue("image", event.image);
    setOldContent(event.description);
    setImagePreview([
      <Image
        src={`/uploads/${event.image}`}
        alt={event.name}
        style={{ width: "100%", height: "100%" }}
        key={event.image}
      />,
    ]);

    open();
  }

  const handleOpenModal = () => {
    open();
    form.setFieldValue("email", email);
  };

  const handleCloseModal = () => {
    form.reset();
    setImagePreview([]);
    setOldContent("");
    close();
  };

  const handleOpenModalDelete = (event: Event) =>
    modals.openConfirmModal({
      // title: "Please confirm your action",
      centered: true,
      children: (
        <Text size="md">
          ต้องการลบกิจกรรม{" "}
          <Text span c="blue" fz="lg" fw="md" inherit>
            {event.name}{" "}
          </Text>
          ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ตกลง", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteEvent(event.id || ""),
    });

  if (!session) {
    return (
      <>
        <>Access Denied</>
      </>
    );
  }

  return (
    <>
      <Grid>
        <Grid.Col xs={12}>
          <Flex justify="start" align="center" direction="row" gap="md">
            <Title order={1}>จัดการกิจกรรม</Title>
            <Button
              onClick={handleOpenModal}
              rightIcon={<IconPlus size="1rem" />}>
              สร้างกิจกรรม
            </Button>

            <Modal
              opened={opened}
              onClose={handleCloseModal}
              title="สร้างกิจกรรม"
              fullScreen
              sx={{
                "& .mantine-Modal-title": {
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  fontFamily: "Prompt, sans-serif",
                },
              }}>
              <Notifications />

              <Grid>
                <Grid.Col xs={12}>
                  <Box component="form" maw={900} mx="auto">
                    <TextInput
                      label="สร้างกิจกรรม"
                      placeholder="สร้างกิจกรรม"
                      withAsterisk
                      {...form.getInputProps("name")}
                    />
                    <Box
                      sx={{
                        padding: "0.75rem 0",
                      }}>
                      <Text>ภาพปก</Text>
                      <UploadImage
                        onGetImage={handleGetImage}
                        imagePreview={imagePreview}
                      />
                    </Box>
                    <Box
                      sx={{
                        padding: "0.75rem 0",
                      }}>
                      <Text>รายละเอียดกิจกรรม</Text>
                      <TextEditor
                        onGetContent={handleGetContent}
                        oldContent={oldContent}
                      />
                    </Box>

                    <Flex justify="space-between" gap={10}>
                      <DateTimePicker
                        label="วัน เวลาเริ่ม"
                        placeholder="วัน เวลาเริ่ม"
                        valueFormat="DD MMM YYYY hh:mm A"
                        w="100%"
                        dropdownType="modal"
                        {...form.getInputProps("period_start")}
                      />
                      <DateTimePicker
                        label="วัน เวลาสิ้นสุด"
                        placeholder="วัน เวลาสิ้นสุด"
                        valueFormat="DD MMM YYYY hh:mm A"
                        w="100%"
                        dropdownType="modal"
                        {...form.getInputProps("period_end")}
                      />
                    </Flex>
                    <TextInput
                      label="สถานที่"
                      placeholder="สถานที่"
                      withAsterisk
                      mt="md"
                      {...form.getInputProps("location")}
                    />

                    <Group position="right" mt="md">
                      {/* <Button
                        onClick={() => handleDeleteEvent(event.id)}
                        bg="red"
                        mr="auto"
                        sx={{
                          ":hover": {
                            backgroundColor: "#FAA0A0",
                          },
                        }}>
                        ลบ
                      </Button> */}
                      <Button
                        bg="gray"
                        sx={{
                          ":hover": {
                            backgroundColor: "#bfbfbf",
                          },
                        }}
                        onClick={() => handleClickSubmit(EventStatus.DRAFT)}>
                        DRAFT
                      </Button>
                      <Button
                        onClick={() =>
                          handleClickSubmit(EventStatus.PUBLISHED)
                        }>
                        PUBLISH
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>

                {/* <Grid.Col xs={12} md={6}>
                  <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                  </TypographyStylesProvider>
                </Grid.Col> */}
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
              <CardEvent
                image={`/uploads/${event.image}`}
                title={event.name}
                location={event.location}
                date={`${convertDate(event.period_start)} - ${convertDate(
                  event.period_end
                )}`}
                time={`${convertTime(event.period_start)} - ${convertTime(
                  event.period_end
                )}`}
                key={index}>
                <Box
                  component="div"
                  sx={{
                    position: "absolute",
                    top: 15,
                    right: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}>
                  <Badge>{event.status}</Badge>
                  <ActionIcon
                    variant="light"
                    size="sm"
                    onClick={() => handleClickEditEvent(event)}>
                    <IconEdit color="gray" size="0.875rem" />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    bg="red"
                    size="sm"
                    onClick={() => handleOpenModalDelete(event)}>
                    <IconTrash color="gray" size="0.875rem" />
                  </ActionIcon>
                </Box>
              </CardEvent>
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </>
  );
}
