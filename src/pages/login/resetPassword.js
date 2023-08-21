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
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../utils/utils";

import { urlApi, validationErrors } from "../../utils/constants";

import CustomSnackbar from "../../components/app/CustomSnackbar";

//Formik
import { useFormik } from "formik";
import * as Yup from "yup";

const theme = createTheme();

const LoginFormScheme = Yup.object().shape({
  password: Yup.string()
    .max(75, validationErrors.user.password.max)
    .required(validationErrors.user.password.required),
  confirmPassword: Yup.string()
    .max(50, validationErrors.user.password.max)
    .required(validationErrors.user.password.required),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [restoreFLag, setRestoreFLag] = useState(false);
  const [snackBar, setSnackBar] = useState({});

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleShowCnfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
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

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: LoginFormScheme,
    validate: (values) => {
      const errors = {};
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
      }
      return errors;
    },
    onSubmit: (values) => {
      LoginEvent(values);
    },
  });

  const LoginEvent = async (values) => {
    let url = window.location.href;
    const response = await resetPassword(
      url.split("token=")[1],
      values.password
    );
    if (response) {
      navigate("/login", { replace: true });
    }

    // if (!response.error) {
    //   //Response API
    //   if (!response.data?.error) {
    //     //Set session
    //     setUserSession(response.data?.results);

    //     navigate("/dashboard/home", { replace: true });
    //   } else {
    //     const errorMessage =
    //       response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

    //     setSnackBar({ opened: true, message: errorMessage, type: "error" });
    //     setRestoreFLag(true);
    //   }
    // } else {
    //   setSnackBar({ opened: true, message: response.message, type: "error" });
    //   setRestoreFLag(true);
    // }
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
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Cambiar contraseña
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="password"
                label="Contraseña"
                name="password"
                autoComplete="password"
                type={showPassword ? "text" : "password"}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowCnfirmPassword} edge="end">
                        <Icon
                          icon={showConfirmPassword ? eyeFill : eyeOffFill}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Cambiar
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
