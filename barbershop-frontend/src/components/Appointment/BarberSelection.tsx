import React from "react";
import { Box, Button, Grid, Typography, Avatar } from "@mui/material";
import { User } from "../../types/User";

interface BarberSelectionProps {
  barbers: User[];
  onBarberSelect: (barberId: string) => void;
}

export const BarberSelection: React.FC<BarberSelectionProps> = ({
  barbers,
  onBarberSelect,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Barber
      </Typography>
      <Grid container spacing={2}>
        {barbers.map((barber) => (
          <Grid item xs={12} key={barber.id}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => onBarberSelect(barber.id)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingLeft: "72px",
                height: "64px",
              }}
            >
              <Avatar
                src={barber.profilePicture}
                alt={barber.name + "'s profile picture"}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 48,
                  height: 48,
                }}
              />
              <span style={{ fontSize: "1rem" }}>{barber.name}</span>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
