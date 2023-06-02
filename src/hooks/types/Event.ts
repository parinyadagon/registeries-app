export interface Event {
  id?: string;
  name: string;
  description: string;
  limit_user: number;
  period_start: string | Date;
  period_end: string | Date;
  status: EventStatus;
  email?: string;
  image?: string;
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface RegisterData {
  name: string;
  email: string;
}
