import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { User } from "../../types/User";
import { useNavigate } from "react-router-dom";

interface BarberCardProps {
  userData: User;
}

export const BarberCard: React.FC<BarberCardProps> = ({ userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
              <AccountCircleIcon />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              {userData.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {userData.email}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
