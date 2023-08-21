import { useState, useEffect } from "react";

import { grey } from "@mui/material/colors";
import {
  TextField,
  Box,
  Grid,
  Typography,
  Container,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { urlApi, validationErrors } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomSnackbar from "../../components/app/CustomSnackbar";

const UserFormScheme = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d+$/, validationErrors.user.phone.valid)
    .max(15, validationErrors.user.phone.max),
  email: Yup.string()
    .email(validationErrors.user.email.valid)
    .max(50, validationErrors.user.email.max)
    .required(validationErrors.user.email.required),
  password: Yup.string()
    .min(5, validationErrors.user.password.min)
    .max(50, validationErrors.user.password.max),
});

export default function Profile() {
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async (idUser) => {
    const response = await sendRequest(
      `${urlApi}/users/profile`,
      null,
      "GET",
      true
    );
    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        //Importtant
        setUser(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const onSubmitForm = async (data) => {
    const response = await sendRequest(
      `${urlApi}/users/profile`,
      data,
      "PUT",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        onOpenSnackbar(true, "Actualizado!", "success");
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;
        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const formik = useFormik({
    initialValues: {
      idCard: user?.user?.idCard ?? "",
      username: user?.user?.username ?? "",
      fullName: user?.user?.fullName ?? "",
      phone: user?.user?.details?.phone ?? "",
      email: user?.user?.email ?? "",
    },

    enableReinitialize: true,
    validationSchema: UserFormScheme,

    onSubmit: (values) => {
      const data = {
        ...(formik.initialValues.email !== values.email && {
          email: values.email,
        }),

        ...(values.phone &&
          formik.initialValues.phone !== values.phone && {
            details: { ...user?.user?.details, phone: values.phone },
          }),

        ...(values.password && { password: values.password }),
      };

      onSubmitForm(data);
    },
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <Container maxWidth="xl">
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            border: "1px solid",
            borderColor: grey[300],
            p: 4,
            mt: 3,
            backgroundColor: "white"
          }}
        >
          <Typography variant="h4" gutterBottom>
            Perfil de usuario
          </Typography>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  id="idCard"
                  name="idCard"
                  label="Cédula"
                  fullWidth
                  autoComplete="family-name"
                  size="small"
                  value={formik.values.idCard || ""}
                  onChange={formik.handleChange}
                  error={formik.touched.idCard && Boolean(formik.errors.idCard)}
                  helperText={formik.touched.idCard && formik.errors.idCard}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  id="username"
                  name="username"
                  label="Usuario"
                  fullWidth
                  autoComplete="given-name"
                  size="small"
                  value={formik.values.username || ""}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  id="fullName"
                  name="fullName"
                  label="Nombres"
                  fullWidth
                  autoComplete=""
                  size="small"
                  value={formik.values.fullName || ""}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fullName && Boolean(formik.errors.fullName)
                  }
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  fullWidth
                  size="small"
                  value={formik.values.email || ""}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Nueva contraseña"
                  fullWidth
                  size="small"
                  value={formik.values.password || ""}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="phone"
                  name="phone"
                  label="Teléfono"
                  fullWidth
                  autoComplete="shipping address-level2"
                  size="small"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  
                  //fullWidth
                >
                  Actualizar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
