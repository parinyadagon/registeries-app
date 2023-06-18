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
  Tooltip,
} from "@mantine/core";
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";

type CardEventProps = {
  image: string;
  time?: string;
  location?: string;
  date?: string;
  title: string;
  children?: React.ReactNode;
  onClick?: () => void;
  bg?: string;
};

export default function CardEvent({
  image,
  time,
  location,
  date,
  title,
  children,
  bg = "",
  onClick,
}: CardEventProps) {
  return (
    <Card
      onClick={onClick}
      shadow="lg"
      bg={bg}
      sx={{
        borderRadius: 5,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "xl",
        },
        "&:active": {
          transform: "translateY(0px)",
          boxShadow: "lg",
        },
      }}>
      <Card.Section>
        <AspectRatio ratio={21 / 9}>
          <Image src={image} withPlaceholder alt="event" fit="cover" />
        </AspectRatio>
      </Card.Section>
      <Group position="apart" pt="sm">
        <Flex justify="center" direction="column">
          <Flex justify="start" align="center" gap="sm">
            <Tooltip label={title} withArrow arrowSize={6}>
              <Text size="xl" fw="bold" lineClamp={1}>
                {title}
              </Text>
            </Tooltip>
          </Flex>
          {date && (
            <Flex justify="start" align="center" gap="sm">
              <IconCalendar size={20} />
              <Text size="sm">{date}</Text>
            </Flex>
          )}
          {time && (
            <Flex justify="start" align="center" gap="sm">
              <IconClock size={20} />
              <Text size="sm">{time}</Text>
            </Flex>
          )}
          {location && (
            <Flex justify="start" align="center" gap="sm">
              <IconMapPin size={20} />
              <Text size="sm">{location}</Text>
            </Flex>
          )}
        </Flex>
      </Group>
      {children}
    </Card>
  );
}
