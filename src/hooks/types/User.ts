export default interface User {
  id: number;
  name: string;
  email: string;
  tel: string;
  type: UserType;
}

export enum UserType {
  ORGANIZER = "ORGANIZER",
  USER = "USER",
}
