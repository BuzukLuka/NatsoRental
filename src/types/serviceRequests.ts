export type ServiceRequestType =
  | "cleaning"
  | "repair"
  | "maintenance"
  | "other";
export type ServiceRequestStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "canceled";

export interface ServiceRequest {
  id: number;
  room_title: string;
  user_name: string;
  booking_id: number;
  request_type: ServiceRequestType;
  description: string;
  status: ServiceRequestStatus;
  assigned_to: number | null; // worker user id (serializer returns PK)
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}
