import React, { useState, useEffect } from "react";
import {
  deleteService,
  createService,
  modifyService,
} from "../../services/ownerService"; // Adjust the import path based on your file structure
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material"; // Material UI components
import { getAllServices } from "../../services/serivces";

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openAddServiceModal, setOpenAddServiceModal] = useState(false);
  const [openModifyServiceModal, setOpenModifyServiceModal] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(
    null
  );
  const [serviceToModify, setServiceToModify] = useState<any | null>(null);

  // State for new service form
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
  });
  const [modifiedService, setModifiedService] = useState({
    name: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (error) {
        setError("Error fetching services");
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDeleteId(serviceId);
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (serviceToDeleteId) {
      // Call your deleteService function with serviceToDeleteId
      try {
        await deleteService(serviceToDeleteId);
        const updatedServices = services.filter(
          (service) => service._id !== serviceToDeleteId
        );
        setServices(updatedServices);
      } catch (error) {
        console.error("Error deleting service:", error);
      } finally {
        setOpenDeleteConfirmation(false);
        setServiceToDeleteId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteConfirmation(false);
    setServiceToDeleteId(null);
  };

  const handleOpenAddServiceModal = () => {
    setOpenAddServiceModal(true);
  };

  // Handler to close Add Service Modal
  const handleCloseAddServiceModal = () => {
    setOpenAddServiceModal(false);
    // Reset form
    setNewService({ name: "", price: "", duration: "" });
  };

  // Handler for input changes in Add Service form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler to submit new service
  const handleAddService = async () => {
    try {
      // Convert price and duration to numbers
      const serviceData = {
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
      };

      const createdService = await createService(serviceData);

      // Add new service to the list
      setServices((prev) => [...prev, createdService]);

      // Close modal and reset form
      handleCloseAddServiceModal();
    } catch (error) {
      console.error("Error adding service:", error);
      // Optionally set an error state to show to user
    }
  };

  const handleModifyClick = (service: any) => {
    setServiceToModify(service);
    setModifiedService({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setOpenModifyServiceModal(true);
  };

  const handleCloseModifyServiceModal = () => {
    setOpenModifyServiceModal(false);
    setServiceToModify(null);
    setModifiedService({ name: "", price: "", duration: "" });
  };

  const handleModifyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModifiedService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModifyService = async () => {
    if (!serviceToModify) return;

    try {
      const serviceData = {
        name: modifiedService.name,
        price: parseFloat(modifiedService.price),
        duration: parseInt(modifiedService.duration),
      };

      const updatedService = await modifyService(
        serviceToModify._id,
        serviceData
      );

      // Update services list
      setServices((prev) =>
        prev.map((service) =>
          service._id === updatedService._id ? updatedService : service
        )
      );

      // Close modal
      handleCloseModifyServiceModal();
    } catch (error) {
      console.error("Error modifying service:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-medium mb-4">Services</h1>
      <div className="flex mb-2">
        <Grid
          container
          justifyContent="flex-end" // Aligns content to the right on large screens
          spacing={2}
        >
          <Grid
            item
            xs={12} // Takes up full width on small screens
            md={2} // Takes up 2 grid spaces (small space) on larger screens
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                width: "100%", // Makes the button take up the full width of the grid item
              }}
              onClick={handleOpenAddServiceModal}
            >
              Add Service
            </Button>
          </Grid>
        </Grid>
      </div>

      {error && <p>{error}</p>}
      {services.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <li key={service._id} className="rounded overflow-hidden shadow-md">
              <CardMedia
                className="h-48 bg-cover bg-center"
                image="https://picsum.photos/id/237/200/140" // Placeholder image
                title={service.name}
              />
              <div className="p-4">
                <CardHeader title={service.name} />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    ${service.price} - {service.duration} min
                  </Typography>
                </CardContent>
                <div className="flex justify-between mt-2">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(service._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleModifyClick(service)}
                  >
                    Modify
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No services available.</p>
      )}
      <Dialog
        open={openAddServiceModal}
        onClose={handleCloseAddServiceModal}
        aria-labelledby="add-service-dialog-title"
      >
        <DialogTitle id="add-service-dialog-title">Add New Service</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Service Name"
            type="text"
            fullWidth
            variant="standard"
            value={newService.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={newService.price}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="standard"
            value={newService.duration}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddServiceModal}>Cancel</Button>
          <Button
            onClick={handleAddService}
            color="primary"
            variant="contained"
            disabled={
              !newService.name || !newService.price || !newService.duration
            }
          >
            Add Service
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modify Service Modal */}
      <Dialog
        open={openModifyServiceModal}
        onClose={handleCloseModifyServiceModal}
        aria-labelledby="modify-service-dialog-title"
      >
        <DialogTitle id="modify-service-dialog-title">
          Modify Service
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Service Name"
            type="text"
            fullWidth
            variant="standard"
            value={modifiedService.name}
            onChange={handleModifyInputChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={modifiedService.price}
            onChange={handleModifyInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="standard"
            value={modifiedService.duration}
            onChange={handleModifyInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModifyServiceModal}>Cancel</Button>
          <Button
            onClick={handleModifyService}
            color="primary"
            variant="contained"
            disabled={
              !modifiedService.name ||
              !modifiedService.price ||
              !modifiedService.duration
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for Delete */}
      <Dialog
        open={openDeleteConfirmation}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this service? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Services;
