import React, { useMemo } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { format, addDays } from "date-fns";
import { User } from "../../types/User";

interface DaySelectionProps {
  barbers: User[];
  selectedBarberId: string;
  onDaySelect: (date: Date) => void;
}

export const DaySelection: React.FC<DaySelectionProps> = ({
  barbers,
  selectedBarberId,
  onDaySelect,
}) => {
  // Generate next 7 days including today
  const availableDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(new Date(), i);
      return {
        date,
        dayOfWeek: date.getDay(),
        formattedDate: format(date, "yyyy-MM-dd"),
        dayName: format(date, "EEEE"),
      };
    });
  }, []);

  // Check if barber is working on this day
  const isDayAvailable = (dayOfWeek: number) => {
    const barber = barbers.find((b) => b.id === selectedBarberId);

    if (!barber) {
      console.error("No barber selected");
      return false;
    }

    const scheduleForDay = barber.workingSchedule?.find(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );

    return scheduleForDay?.isWorking || false;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Day
      </Typography>
      <Grid container spacing={2}>
        {availableDays.map((day) => {
          const isAvailable = isDayAvailable(day.dayOfWeek);

          return (
            <Grid item xs={4} key={day.formattedDate}>
              <Button
                variant={isAvailable ? "contained" : "outlined"}
                fullWidth
                disabled={!isAvailable}
                onClick={() => onDaySelect(day.date)}
              >
                {day.dayName + " "}
                {format(day.date, "MMM dd")}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
