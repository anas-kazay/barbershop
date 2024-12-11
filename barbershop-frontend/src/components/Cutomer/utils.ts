import { format, parseISO } from "date-fns";

export const formatAppointmentTime = (isoTime: string) => {
  try {
    const parsedDate = parseISO(isoTime);
    return format(parsedDate, "MMMM d, yyyy 'at' h:mm a");
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoTime;
  }
};

export const getStatusChipProps = (status: string) => {
  switch (status) {
    case "pending":
      return { color: "warning", label: "Pending" };
    case "confirmed":
      return { color: "info", label: "Confirmed" };
    case "completed":
      return { color: "success", label: "Completed" };
    case "cancelled":
      return { color: "error", label: "Cancelled" };
    default:
      return { color: "default", label: status };
  }
};

export const getStatusButtonProps = (status: string) => {
  switch (status) {
    case "pending":
      return { color: "warning", label: "Cancel" };
    case "confirmed":
    case "completed":
    case "cancelled":
      return null; // No button for these statuses
    default:
      return { color: "default", label: status };
  }
};
