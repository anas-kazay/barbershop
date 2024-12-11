import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { User } from "../../types/User";

interface UserCardProps {
  user: User;
  onLogout: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onLogout }) => {
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
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user.email}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
