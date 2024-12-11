import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface AppointmentStatusModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AppointmentStatusModal: React.FC<AppointmentStatusModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="status-change-dialog-title"
      aria-describedby="status-change-dialog-description"
    >
      <DialogTitle id="status-change-dialog-title">
        Confirm Appointment Status Change
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="status-change-dialog-description">
          Are you sure you want to cancel this appointment? This action cannot
          be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No, Keep Current Status
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Yes, Change Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};
