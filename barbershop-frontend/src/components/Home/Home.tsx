import { useState, useEffect } from "react";
import { Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { User } from "../../types/User";
import { Service } from "../../types/Service";
import { getAllBarbers } from "../../services/barbers";
import { getAllServices } from "../../services/serivces";
import { Navbar } from "../Navbar/Navbar";
import { Barbers } from "./Barbers";
import { Services } from "./Services";

const Home = () => {
  const [barbers, setBarbers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barbersData = await getAllBarbers();
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
        <Barbers barbers={barbers} />

        {/* Services Section */}
        <Services services={services} />
      </div>
    </>
  );
};

export default Home;
