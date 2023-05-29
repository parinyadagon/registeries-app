import { useState, useEffect } from "react";
import {
  Group,
  Text,
  useMantineTheme,
  rem,
  Image,
  AspectRatio,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import {
  Dropzone,
  DropzoneProps,
  IMAGE_MIME_TYPE,
  FileWithPath,
} from "@mantine/dropzone";

interface UploadImageProps extends Partial<DropzoneProps> {
  onGetImage: (
    file: FileWithPath[] | undefined,
    preview: JSX.Element[]
  ) => void;
  imagePreview?: JSX.Element[];
}

export default function UploadImage({
  onGetImage,
  imagePreview,
  ...other
}: UploadImageProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [previews, setPreviews] = useState<JSX.Element[]>([]);

  const handleDrop = (files: FileWithPath[]) => {
    setFiles(files);
    const previews = files.map((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      return (
        <Image
          key={index}
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          alt="preview"
        />
      );
    });

    setPreviews(previews);
  };

  useEffect(() => {
    onGetImage(files, previews);
  }, [files, onGetImage, previews]);

  useEffect(() => {
    if (imagePreview) setPreviews(imagePreview);
  }, [imagePreview]);

  const theme = useMantineTheme();
  return (
    <Dropzone
      onDrop={handleDrop}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...other}>
      {previews.length < 1 ? (
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload
              size="3.2rem"
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size="3.2rem"
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size="3.2rem" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      ) : (
        <AspectRatio ratio={21 / 9}>{previews}</AspectRatio>
      )}
    </Dropzone>
  );
}
