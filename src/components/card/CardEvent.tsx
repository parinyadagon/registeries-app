import {
  SimpleGrid,
  Card,
  Title,
  Text,
  Button,
  Badge,
  Container,
  Image,
  AspectRatio,
  Group,
  Box,
  Flex,
} from "@mantine/core";
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";

type CardEventProps = {
  image: string;
  time: string;
  location: string;
  date: string;
  title: string;
  children?: React.ReactNode;
};

export default function CardEvent({
  image,
  time,
  location,
  date,
  title,
  children,
}: CardEventProps) {
  return (
    <Card
      shadow="lg"
      padding="sm"
      sx={{
        borderRadius: 5,
      }}>
      <Card.Section>
        <AspectRatio ratio={21 / 9}>
          <Image src={image} withPlaceholder alt="event" fit="cover" />
        </AspectRatio>
      </Card.Section>
      <Group position="apart" pt="sm">
        <Flex justify="center" direction="column">
          <Flex justify="start" align="center" gap="sm">
            <Text size="xl" fw="bold" lineClamp={1}>
              {title}
            </Text>
          </Flex>
          <Flex justify="start" align="center" gap="sm">
            <IconCalendar size={20} />
            <Text size="sm">{date}</Text>
          </Flex>
          <Flex justify="start" align="center" gap="sm">
            <IconClock size={20} />
            <Text size="sm">{time}</Text>
          </Flex>
          <Flex justify="start" align="center" gap="sm">
            <IconMapPin size={20} />
            <Text size="sm">{location}</Text>
          </Flex>
        </Flex>
      </Group>
      {children}
    </Card>
  );
}
