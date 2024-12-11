import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Service } from "../../types/Service";

interface ServiceSelectionProps {
  services: Service[];
  selectedServiceIds: string[];
  onServiceSelect: (serviceId: string) => void;
  onNextStep: () => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedServiceIds,
  onServiceSelect,
  onNextStep,
}) => {
  const isSelected = (serviceId: string) =>
    selectedServiceIds?.includes(serviceId) || false;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Services
      </Typography>
      {services.map((service) => (
        <FormControlLabel
          key={service._id}
          control={
            <Checkbox
              checked={isSelected(service._id)}
              onChange={() => onServiceSelect(service._id)}
            />
          }
          label={`${service.name} - $${service.price}`}
        />
      ))}
      <Button
        variant="contained"
        fullWidth
        onClick={onNextStep}
        disabled={!selectedServiceIds?.length}
        sx={{ mt: 2 }}
      >
        Next
      </Button>
    </Box>
  );
};
