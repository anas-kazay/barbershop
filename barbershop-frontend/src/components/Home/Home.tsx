import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import { User } from "../../types/User";
import { Service } from "../../types/Service";
import { getAllBarbers } from "../../services/barbers";
import { getAllServices } from "../../services/serivces";
import { Navbar } from "../Navbar/Navbar";
import defaultAvatar from "./../../assets/default-avatar.png";
const Home = () => {
  const [barbers, setBarbers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barbersData = await getAllBarbers();
        console.log("Fetched barbers data:", barbersData);
        const servicesData = await getAllServices();
        setBarbers(barbersData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50">
        {/* Banner Section */}
        <div
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <Container className="relative z-10 text-center">
            <Typography
              variant="h2"
              className="text-white font-bold mb-4 drop-shadow-lg"
            >
              Premium Barbershop Experience
            </Typography>
            <Typography
              variant="h5"
              className="text-gray-200 mb-8 drop-shadow-md"
            >
              Precision Cuts, Classic Styles, Modern Comfort
            </Typography>
            <Button
              component={Link}
              to="/appointment"
              variant="contained"
              color="primary"
              size="large"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Book Your Appointment
            </Button>
          </Container>
        </div>

        {/* Barbers Section */}
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

        {/* Services Section */}
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
      </div>
    </>
  );
};

export default Home;
