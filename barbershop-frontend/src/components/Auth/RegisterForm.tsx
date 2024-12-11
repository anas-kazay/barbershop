import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/users";
import { useState } from "react";
import { Navbar } from "../Navbar/Navbar";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "customer",
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
  const [isSuccess, setIsSuccess] = useState(false); // Track successful registration state

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true); // Indicate form submission in progress
    try {
      await registerUser(values.fullName, values.email, values.password);
      setIsSuccess(true); // Set success state for message display
      navigate("/login"); // Redirect to login page after a delay
    } catch (error) {
      console.error("Registration failed:", error);
      // Implement error handling (e.g., display an error message)
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Card
          sx={{
            width: "400px",
            p: 3,
            mt: 8,
          }}
        >
          <CardContent>
            <Typography variant="h5" className="text-center">
              Register
            </Typography>
            {isSuccess && (
              <Alert severity="success">Registration successful!</Alert>
            )}
            <Formik onSubmit={handleSubmit} initialValues={initialValues}>
              <Form>
                <Field
                  as={TextField}
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="password"
                />

                <Button
                  sx={{ mt: 2, padding: "1rem" }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  className="mt-5"
                  disabled={isSubmitting} // Disable button during submission
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </Form>
            </Formik>
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              If you have an account?
              <Button size="small" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default RegisterForm;
