import { UserRole } from "./UserRole";
import { WorkingSchedule } from "./WorkingSchedule";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string; // Assuming you'll store URLs for images on the frontend
  portfolio?: string[]; // Assuming you'll store URLs for portfolio images
  workingSchedule?: WorkingSchedule[];
}
