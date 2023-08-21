/** @format */

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendRequest, setUserSession, forgetPassword } from "../../utils/utils";

import { urlApi, validationErrors } from "../../utils/constants";

import CustomSnackbar from "../../components/app/CustomSnackbar";

//Formik
import { useFormik } from "formik";
import * as Yup from "yup";

const theme = createTheme();

const LoginFormScheme = Yup.object().shape({
  email: Yup.string()
    .max(75, validationErrors.user.email.max)
    .required(validationErrors.user.email.required),
});

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [snackBar, setSnackBar] = useState({});

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginFormScheme,

    onSubmit: (values) => {
      LoginEvent(values);
    },
  });

  const LoginEvent = async (values) => {
    const response = await forgetPassword(values.email);

    if (!response.error) {
      setSnackBar({
        opened: true,
        message: response.message,
        type: "info",
      });

      // if (!response.data?.error) {
      //   //Set session
      //   setUserSession(response.data?.results);

      //   navigate("/dashboard/home", { replace: true });
      // } else {
      //   const errorMessage =
      //     response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

      //   setSnackBar({ opened: true, message: errorMessage, type: "error" });
      // }
    } else {
      setSnackBar({ opened: true, message: response.message, type: "error" });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />

        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(/static/images/login_condor.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mx: 4,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
              Recuperar contraseña
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ mt: 1, width: "100%", justifyItems: "center" }}
            >
              <TextField
                type="email"
                margin="normal"
                fullWidth
                id="Correo"
                label="Correo"
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Enviar
              </Button>

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
