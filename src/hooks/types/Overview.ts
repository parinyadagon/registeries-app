import { User } from "@prisma/client";

export interface Overview {
  listUsers: listUser[];
  userAttend: number;
  userNotAttend: number;
}

export interface listUser {
  name: string;
  email: string;
  status: string;
  code: string;
}
