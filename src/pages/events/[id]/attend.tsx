import {
  Container,
  TextInput,
  Card,
  Text,
  Flex,
  Box,
  Button,
  Center,
} from "@mantine/core";

export default function Attend() {
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
            />
          </Flex>
          <Flex direction="row" justify="center" mt="lg">
            <Button>เข้าร่วม</Button>
          </Flex>
        </Card>
      </Box>
    </Center>
  );
}
