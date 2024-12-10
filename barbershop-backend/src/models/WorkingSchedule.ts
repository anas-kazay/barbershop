export interface WorkingSchedule {
  dayOfWeek: number; // Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  startTime: string; // Start time for the workday
  endTime: string; // End time for the workday
  isWorking: boolean;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
