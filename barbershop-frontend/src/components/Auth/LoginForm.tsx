import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/users";

const initialValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values: any) => {
    try {
      const success = await loginUser(values.email, values.password);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          width: "400px",
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Login
          </Typography>
          <Formik onSubmit={handleSubmit} initialValues={initialValues}>
            <Form>
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
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <Button
                sx={{ mt: 2, padding: "1rem" }}
                fullWidth
                type="submit"
                variant="contained"
              >
                Login
              </Button>
              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  {error}
                </Typography>
              )}
            </Form>
          </Formik>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don't have an account?
            <Button size="small" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
