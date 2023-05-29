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
import { IconCheck, IconX, IconPlus, IconEdit } from "@tabler/icons-react";
import { Notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { FileWithPath } from "@mantine/dropzone";

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

export default function CreatePage() {
  useTitle("Event Management");
  const { data: session } = useSession();
  const email: string = useMemo(
    () => session?.user?.email || "",
    [session?.user?.email]
  );

  const [opened, { open, close }] = useDisclosure(false);

  const [events, setEvents] = useState<Event[]>([]);

  useEffectOnce(() => {
    return () => {
      Notifications.clean();
    };
  });

  useEffect(() => {
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
  }, [email]);

  const form = useForm<Event>({
    initialValues: {
      name: "",
      description: "",
      limit_user: 18,
      period_start: "",
      period_end: "",
      status: EventStatus.DRAFT,
      email: "",
      image: "",
    },

    validate: {
      name: isNotEmpty(),
      limit_user: isNotEmpty(),
      period_start: isNotEmpty(),
      period_end: isNotEmpty(),
    },
  });

  const handleClickSubmit = async (save_type: string) => {
    if (!form.validate().hasErrors) {
      form.setFieldValue("email", email);
      if (save_type === "PUBLISHED") {
        form.setFieldValue("status", EventStatus.PUBLISHED);
      } else {
        form.setFieldValue("status", EventStatus.DRAFT);
      }

      form.setFieldValue("description", content);
      const { newImageName } = await uploadToServer();
      form.setFieldValue("image", newImageName);

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

  // Rich Text Editor.
  const [content, setContent] = useState<string>(``);
  const [oldContent, setOldContent] = useState<string>("");

  const handleGetContent = (content: string | undefined) => {
    if (content === undefined) return;
    setContent(content);
  };

  // Image Upload
  const [image, setImage] = useState<FileWithPath[] | undefined>();
  const [imagePreview, setImagePreview] = useState<JSX.Element[]>([]);
  const handleGetImage = (
    image: FileWithPath[] | undefined,
    imagePreview: JSX.Element[]
  ) => {
    if (image === undefined) return;
    setImage(image);
    // setImagePreview(imagePreview);
  };

  // อัพโหลดไฟล์ รูปภาพ ไปยัง server และรับชื่อไฟล์ใหม่กลับมา
  // bug ถ้าไม่มีการอัพโหลดรูปภาพ จะไม่สามารถสร้าง ได้รับชื่อไฟล์ใหม่กลับมา

  async function uploadToServer(): Promise<{
    newImageName: string;
    error: string | null;
  }> {
    const formData = new FormData();
    return new Promise(async (resolve, reject) => {
      if (image === undefined) {
        reject({ newImageName: "", error: null });
      } else {
        for (let file of image) {
          if (file instanceof File) formData.append("file", file);
        }
      }
      const response = await fetch("/api/event/upload", {
        method: "POST",
        body: formData,
      });
      /* *************************************** BUG */
      if (response.ok) {
        const { files } = await response.json();
        const newImageName = files.newFilename;

        resolve({ newImageName, error: null });
      } else {
        reject({ newImageName: "", error: "Upload failed" });
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
    form.setFieldValue("name", event.name);
    form.setFieldValue("description", event.description);
    form.setFieldValue("limit_user", event.limit_user);
    form.setFieldValue("period_start", dayjs(event.period_start).toDate());
    form.setFieldValue("period_end", dayjs(event.period_end).toDate());
    form.setFieldValue("status", event.status);
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

  const handleCloseModal = () => {
    form.reset();
    setImagePreview([]);
    setOldContent("");
    close();
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
              onClose={handleCloseModal}
              title="Create Event"
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
                      label="Event Name"
                      placeholder="Event Name"
                      withAsterisk
                      {...form.getInputProps("name")}
                    />
                    <Box
                      sx={{
                        padding: "0.75rem 0",
                      }}>
                      <Text>Image Cover</Text>
                      <UploadImage
                        onGetImage={handleGetImage}
                        imagePreview={imagePreview}
                      />
                    </Box>
                    <Box
                      sx={{
                        padding: "0.75rem 0",
                      }}>
                      <Text>Description</Text>
                      <TextEditor
                        onGetContent={handleGetContent}
                        oldContent={oldContent}
                      />
                    </Box>

                    <Flex justify="space-between" gap={10}>
                      <DateTimePicker
                        label="Period start"
                        placeholder="Pick date and time"
                        valueFormat="DD MMM YYYY hh:mm A"
                        w="100%"
                        dropdownType="modal"
                        {...form.getInputProps("period_start")}
                      />
                      <DateTimePicker
                        label="Period end"
                        placeholder="Pick date and time"
                        valueFormat="DD MMM YYYY hh:mm A"
                        w="100%"
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
                location="location"
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
                </Box>
              </CardEvent>
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </>
  );
}
