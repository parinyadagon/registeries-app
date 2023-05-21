export interface Event {
  name: string;
  description: string;
  limit_user: number;
  period_start: string;
  period_end: string;
  status: EventStatus;
  email?: string;
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}
