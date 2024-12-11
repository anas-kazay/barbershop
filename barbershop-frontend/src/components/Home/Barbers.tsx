import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
} from "@mui/material";
import { User } from "../../types/User";
import defaultAvatar from "./../../assets/default-avatar.png";

interface BarbersProps {
  barbers: User[];
}

export const Barbers: React.FC<BarbersProps> = ({ barbers }) => {
  return (
    <Container className="py-16">
      <Typography
        variant="h3"
        className="text-center pb-12 font-bold text-[#2b98d3]"
      >
        Our Expert Barbers
      </Typography>
      <Grid container spacing={4}>
        {barbers.map((barber) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={barber.id}
            className="flex justify-center"
          >
            <Card className="hover:shadow-xl transition-shadow duration-300 w-64">
              <CardMedia
                component="img"
                height="250"
                image={barber.profilePicture || defaultAvatar}
                alt={barber.name}
                className="h-64 w-64 object-cover rounded-full mx-auto mt-4"
                sx={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <CardContent className="text-center">
                <Typography variant="h6" className="font-semibold">
                  {barber.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
