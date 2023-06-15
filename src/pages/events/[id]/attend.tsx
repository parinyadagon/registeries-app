import { fetchWithMethod } from "@/hooks";
import { useRouter } from "next/router";
import { useState } from "react";

import { useDisclosure } from "@mantine/hooks";

import {
  Modal,
  Group,
  TextInput,
  Card,
  Text,
  Flex,
  Box,
  Button,
  Center,
} from "@mantine/core";

export default function Attend() {
  const router = useRouter();

  const [code, setCode] = useState<string>("");
  const [textSuccess, setTextSuccess] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  function handleClickSend() {
    if (code)
      fetchWithMethod<{
        message: string;
        status: string;
      }>(`/api/event/${router.query.id}/attend`, "POST", { code }).then(
        (res) => {
          if (res.data) setTextSuccess(res.data?.message);
          open();
        }
      );
  }

  return (
    <Center h="85vh">
      <Box w={{ base: "25rem" }}>
        <Card
          withBorder
          p={{ base: "1.5rem" }}
          h="100%"
          sx={{
            textAlignLast: "center",
          }}>
          <Text align="center" fz={{ base: "2rem", lg: "2.5rem" }}>
            เข้าร่วมกิจกรรม
          </Text>
          <Text align="center">กรอกรหัสเพื่อเข้าร่วมกิจกรรม</Text>
          <Flex direction="row" justify="center" mt="2rem">
            <TextInput
              w={{ base: "90%" }}
              placeholder="กรอกรหัสที่นี้"
              size="lg"
              onChange={(e) => setCode(e.target.value)}
            />
          </Flex>
          <Flex direction="row" justify="center" mt="lg">
            <Button onClick={handleClickSend}>เข้าร่วม</Button>
          </Flex>
        </Card>
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          <Text align="center" fz={{ base: "1.5rem", lg: "2rem" }}>
            {textSuccess}
          </Text>
        </Modal>
      </Box>
    </Center>
  );
}
