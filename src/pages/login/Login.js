/** @format */

import * as React from "react";
import "./styles/login.css";
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
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendRequest, setUserSession } from "../../utils/utils";

import { urlApi, validationErrors } from "../../utils/constants";

import CustomSnackbar from "../../components/app/CustomSnackbar";
import PersonIcon from '@mui/icons-material/Person';
import LockPersonIcon from '@mui/icons-material/LockPerson'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//Formik
import { useFormik } from "formik";
import * as Yup from "yup";

const theme = createTheme();

const LoginFormScheme = Yup.object().shape({
  username: Yup.string()
    .max(75, validationErrors.user.username.max)
    .required(validationErrors.user.username.required),
  password: Yup.string()
    .max(50, validationErrors.user.password.max)
    .required(validationErrors.user.password.required),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [restoreFLag, setRestoreFLag] = useState(false);
  const [snackBar, setSnackBar] = useState({});

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const themetipogr = createTheme({
    typography: {
      h6: {
        fontSize: "0.8rem",
        textAlign: "right",
        color: "#007BFF",
        cursor: "pointer",
        textDecoration: "underline",
      },
    },
  });
  const handleRedirect = () => {
    navigate("/forget-password", { replace: true });
  };
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginFormScheme,

    onSubmit: (values) => {
      LoginEvent(values);
    },
  });

  const LoginEvent = async (values) => {
    const response = await sendRequest(
      `${urlApi}/auth/signin`,
      values,
      "POST",
      false
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        //Set session
        setUserSession(response.data?.results);

        navigate("/dashboard/home", { replace: true });
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        setSnackBar({ opened: true, message: errorMessage, type: "error" });
        setRestoreFLag(true);
      }
    } else {
      setSnackBar({ opened: true, message: response.message, type: "error" });
      setRestoreFLag(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container 
      component="main" sx={{ height: "100vh", backgroundColor: "#1B2144" }}>
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />

        <CssBaseline />        
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            backgroundImage: "url(/static/images/login_condor_vector.png)",
            backgroundSize: "contain",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            height: 300
          }}
        />
        <Grid 
          container
          item 
          xs={12} 
          sm={8} 
          md={4} 
          component={Paper}
          elevation={3}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "35px",
            border: "1px solid rgba(0, 0, 0, 0.00)",
            background: "rgba(250, 187, 63, 0.93)",
            margin: "auto", // Center horizontally
            mt: 2, // Add margin from the top
            mb: 6, // Add margin from the bottom
          }}
          /*component={Paper} 
          elevation={6} square*/>
          <Box
            sx={{ my: 8, mx: 4 }}
          >
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <AccountCircleIcon sx={{ fontSize: "4rem", color: "#1B2144" }} />
              <Typography component="h1" variant="h5" sx={{ mb: 3, color: "#1B2144", fontSize: "1.5rem", textAlign: "center" }}>
                Iniciar sesión
              </Typography>
            </div>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Usuario"
                name="username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
                sx={{
                  backgroundColor: "#FFFFFF", // White background
                  color: "#1B2144", // Text color
                  borderRadius: "10px", // Adjust as needed
                  "& label": {
                    color: "#1B2144", // Label text color
                  },
                  "& .MuiInputBase-input": {
                    color: "#1B2144", // Text color for input
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#1B2144" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  backgroundColor: "#FFFFFF", // White background
                  color: "#1B2144", // Text color
                  borderRadius: "10px", // Adjust as needed
                  "& label": {
                    color: "#1B2144", // Label text color
                  },
                  "& .MuiInputBase-input": {
                    color: "#1B2144", // Text color for input
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockPersonIcon sx={{ color: "#1B2144" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {<FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      sx={{
                        backgroundColor: "transparent", 
                        transform: "scale(0.75)",
                        "&.Mui-checked": {
                          color: "#1B2144", 
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.9rem", color: "#1B2144" }}>
                      Recuerdame
                    </Typography>
                  }
                  sx={{
                    "& .MuiTypography-root": {
                    ml: -0.5,  
                  },}}
              />}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#1B2144", 
                  color: "#FFFFFF", 
                  "&:hover": {
                    backgroundColor: "#0F131C",
                  },
                }}
              >
                Login
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Olvidó su contraseña?
                  </Link>
                </Grid>
                 <Grid item>
                  <Link href="#" variant="body2">
                    No tiene cuenta? Registrarse
                  </Link>
                </Grid>  
              </Grid> */}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Condor
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}
