import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getAllBarbers } from "../../services/barbers";
import {
  createBarber,
  deleteUser,
  updateBarberSchedule,
} from "../../services/ownerService"; // Import the delete function

// Import the types you provided
import { User } from "./../../types/User";
import { WorkingSchedule } from "../../types/WorkingSchedule";

const daysOfWeek: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Barbers: React.FC = () => {
  const [barbers, setBarbers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [modifyScheduleModalOpen, setModifyScheduleModalOpen] =
    useState<boolean>(false);
  const [selectedBarber, setSelectedBarber] = useState<User | null>(null);
  const [modifiedSchedule, setModifiedSchedule] = useState<WorkingSchedule[]>(
    []
  );

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const fetchedBarbers: User[] = await getAllBarbers();
        setBarbers(fetchedBarbers);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
        // Remove the deleted user from the list
        setBarbers(barbers.filter((barber) => barber.id !== userToDelete));
        setDeleteConfirmOpen(false);
      } catch (err) {
        console.error("Failed to delete user:", err);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newBarberData, setNewBarberData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newBarberSchedule, setNewBarberSchedule] = useState<WorkingSchedule[]>(
    daysOfWeek.map((_, index) => ({
      dayOfWeek: index,
      startTime: "",
      endTime: "",
      isWorking: false,
    }))
  );

  // Add these new handler methods
  const handleCreateBarberOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateBarberClose = () => {
    setCreateModalOpen(false);
    // Reset form
    setNewBarberData({ name: "", email: "", password: "" });
    setNewBarberSchedule(
      daysOfWeek.map((_, index) => ({
        dayOfWeek: index,
        startTime: "",
        endTime: "",
        isWorking: false,
      }))
    );
  };

  const handleCreateBarberSubmit = async () => {
    try {
      // Combine barber data and schedule
      const barberData = {
        ...newBarberData,
        workingSchedule: newBarberSchedule,
      };

      // Call create barber service
      const newBarber = await createBarber(barberData);

      // Update barbers list
      setBarbers([...barbers, newBarber]);

      // Close modal
      handleCreateBarberClose();
    } catch (err) {
      console.error("Failed to create barber:", err);
    }
  };

  const handleModifyClick = (barber: User) => {
    setSelectedBarber(barber);
    setModifiedSchedule(
      barber.workingSchedule?.length
        ? barber.workingSchedule.map((schedule) => ({
            ...schedule, // Copy all properties from existing schedule
          }))
        : daysOfWeek.map((_day, index) => ({
            dayOfWeek: index,
            startTime: "",
            endTime: "",
            isWorking: false,
          }))
    );
    setModifyScheduleModalOpen(true);
  };

  const handleModifyScheduleSubmit = async () => {
    if (selectedBarber) {
      try {
        await updateBarberSchedule(selectedBarber.id, {
          workingSchedule: modifiedSchedule,
        });

        // Update the barbers list with the new schedule
        setBarbers(
          barbers.map((barber) =>
            barber.id === selectedBarber.id
              ? { ...barber, workingSchedule: modifiedSchedule }
              : barber
          )
        );

        // Close the modal
        setModifyScheduleModalOpen(false);
      } catch (err) {
        console.error("Failed to update barber schedule:", err);
      }
    }
  };

  const handleScheduleChange = (
    index: number,
    field: "startTime" | "endTime" | "isWorking",
    value: string
  ) => {
    const updatedSchedule = [...modifiedSchedule];

    if (field === "isWorking") {
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        isWorking: value === "true", // Convert string value to boolean
      };
    } else {
      const currentSchedule = updatedSchedule[index];
      const updatedField = { ...currentSchedule, [field]: value };

      if (
        field === "endTime" &&
        currentSchedule.startTime &&
        value < currentSchedule.startTime
      ) {
        // Alert if the selected endTime is before the startTime
        alert("End time cannot be before start time.");
        return; // Exit without updating
      }

      updatedSchedule[index] = updatedField;
    }

    setModifiedSchedule(updatedSchedule);
  };

  const renderScheduleTable = (workingSchedule?: WorkingSchedule[]) => {
    // Create a map of working days for easy lookup
    const scheduleMap = new Map(
      workingSchedule?.map((schedule) => [schedule.dayOfWeek, schedule]) || []
    );

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Is Working</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daysOfWeek.map((day, index) => {
              const schedule = scheduleMap.get(index);
              return (
                <TableRow key={day}>
                  <TableCell>{day}</TableCell>
                  <TableCell>
                    {schedule
                      ? `${schedule.startTime} - ${schedule.endTime}`
                      : "Not Working"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={schedule?.isWorking ? "Working" : "Not Working"}
                      color={schedule?.isWorking ? "primary" : "secondary"}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        Error loading barbers: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Our Barbers
      </Typography>
      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateBarberOpen}
        >
          Create New Barber
        </Button>
      </Box>
      {barbers.map((barber) => (
        <Accordion key={barber.id} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${barber.id}-content`}
            id={`${barber.id}-header`}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                src={barber.profilePicture}
                alt={barber.name}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{barber.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {barber.email}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              container
              justifyContent="flex-end"
              spacing={2}
              className="mb-2"
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleModifyClick(barber)}
                >
                  Modify
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteClick(barber.id)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
            {renderScheduleTable(barber.workingSchedule)}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this barber? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={createModalOpen}
        onClose={handleCreateBarberClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Barber</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={newBarberData.name}
              onChange={(e) =>
                setNewBarberData({ ...newBarberData, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={newBarberData.email}
              onChange={(e) =>
                setNewBarberData({ ...newBarberData, email: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newBarberData.password}
              onChange={(e) =>
                setNewBarberData({ ...newBarberData, password: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateBarberClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateBarberSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modifyScheduleModalOpen}
        onClose={() => setModifyScheduleModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Modify Barber Schedule</DialogTitle>
        <DialogContent>
          <Box>
            {daysOfWeek.map((day, index) => (
              <Box key={day} display="flex" alignItems="center" mb={2}>
                <Typography variant="body1" sx={{ mr: 2, width: 100 }}>
                  {day}
                </Typography>
                <TextField
                  label="Start Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min steps
                  sx={{ mr: 2 }}
                  value={modifiedSchedule[index]?.startTime || ""}
                  onChange={(e) =>
                    handleScheduleChange(index, "startTime", e.target.value)
                  }
                />
                <TextField
                  label="End Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min steps
                  value={modifiedSchedule[index]?.endTime || ""}
                  onChange={(e) =>
                    handleScheduleChange(index, "endTime", e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    // Toggle isWorking based on its current value
                    const isWorking = !modifiedSchedule[index]?.isWorking;
                    handleScheduleChange(
                      index,
                      "isWorking",
                      isWorking ? "true" : "false"
                    ); // Ensure string values for consistent handling
                  }}
                  sx={{ ml: "auto" }} // Align button to the right (optional)
                >
                  {modifiedSchedule[index]?.isWorking
                    ? "Working"
                    : "Not Working"}
                </Button>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModifyScheduleModalOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleModifyScheduleSubmit} color="primary">
            Update Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Barbers;
