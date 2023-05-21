import { Button, ButtonProps, Group } from "@mantine/core";
import { GoogleIcon } from "./GoogleIcon";

interface GoogleButtonProps extends ButtonProps {
  logIn: () => void;
}

export function GoogleButton({ logIn, ...other }: GoogleButtonProps) {
  return (
    <Button
      leftIcon={<GoogleIcon />}
      onClick={() => logIn()}
      variant="default"
      color="gray"
      {...other}
    />
  );
}
