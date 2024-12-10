export interface WorkingSchedule {
  dayOfWeek: number;
  startTime: string; // Consider using a time-only format or a library like `luxon` for better time handling
  endTime: string;
  isWorking: boolean;
}
