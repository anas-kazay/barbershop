import { WorkingSchedule } from "../models/WorkingSchedule";

export interface UpdateScheduleDTO {
  barberId: string; // Barber's ID
  newSchedule: WorkingSchedule[]; // Array of new working schedules to set
}
