import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false); // Add loading state

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = data.get("id");
    const password = data.get("password");

    if (id && password) {
      setLoading(true); // Set loading to true when request starts
      try {
        let apiUrl = "";
        let requestBody = {};

        if (id.length === 12) {
          apiUrl = "http://localhost:8000/api/loginUser";
          requestBody = {
            id_user: id,
            password: password,
          };
        } else if (id.length === 18) {
          apiUrl = "http://localhost:8000/api/loginPengelola";
          requestBody = {
            id_pengelola: id,
            password: password,
          };
        } else {
          setError("Invalid ID length.");
          setLoading(false); // Set loading to false if there's an error
          return;
        }

        const response = await axios.post(apiUrl, requestBody);

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          if (id.length === 12) {
            navigate("/form");
          } else if (id.length === 18) {
            navigate("/dashboardpengelola");
          }
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Wrong ID or password.");
        } else {
          console.error("Error during login:", error);
          setError("An error occurred. Please try again later.");
        }
      } finally {
        setLoading(false); // Set loading to false after request finishes
      }
    } else {
      setError("Please fill out both ID and password fields.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh", overflow: "hidden" }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url("https://um.ac.id/wp-content/themes/umlearning/images/headerNew.jpg")',
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "left",
            backgroundRepeat: "no-repeat",
            height: "100%",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="flex items-center text-white mb-10">
              <img
                src="https://um.ac.id/wp-content/uploads/2020/08/cropped-Lambang-UM-300x300.png"
                alt="Logo"
                className="w-32 h-32"
              />
              <div className="ml-4 font-poppins text-black text-3xl font-bold">
                Lapor-UM
              </div>
            </div>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="id"
                label="ID Number"
                name="id"
                autoComplete="id"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}{" "}
                {/* Show spinner when loading */}
              </Button>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
