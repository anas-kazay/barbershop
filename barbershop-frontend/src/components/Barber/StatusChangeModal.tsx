import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface StatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
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
        Confirm Appointment Completion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="status-change-dialog-description">
          Are you sure you want to mark this appointment as completed? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No, Keep Current Status
        </Button>
        <Button onClick={onConfirm} color="success" autoFocus>
          Yes, Mark Completed
        </Button>
      </DialogActions>
    </Dialog>
  );
};
