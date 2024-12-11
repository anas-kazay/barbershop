import React from "react";
import { Typography, Card, CardContent, Grid, Container } from "@mui/material";
import { Service } from "../../types/Service";

interface ServicesProps {
  services: Service[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <div className="bg-white py-16">
      <Container>
        <Typography
          variant="h3"
          className="text-center mb-12 pb-5 font-bold text-[#2b98d3]"
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service._id}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" className="mb-2 font-semibold">
                    {service.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Price: ${service.price}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Duration: {service.duration} minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};
