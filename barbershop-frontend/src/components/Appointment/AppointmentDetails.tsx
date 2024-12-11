import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Appointment } from "../../types/Appointment";

interface AppointmentDetailsProps {
  formData: Partial<Appointment>;
  onSubmit: (comment: string) => void;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  onSubmit,
}) => {
  const [localComment, setLocalComment] = useState("");

  const handleSubmit = async () => {
    onSubmit(localComment);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Appointment Details
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Additional Comments"
        value={localComment}
        onChange={(e) => setLocalComment(e.target.value)}
        placeholder="Any special requests?"
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Book Appointment
      </Button>
    </Box>
  );
};
