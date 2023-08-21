import { useState, useEffect } from "react";
import { grey } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { urlApi } from "../../utils/constants";
import { getUserSession, sendRequest } from "../../utils/utils";
import { UserCreateScheme } from "./validations";

import {
  TextField,
  Box,
  Grid,
  Button,
  InputAdornment,
  IconButton,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Switch,
  Link,
} from "@mui/material";

import UploadImagesComponent from "../../components/UploadImages";

export default function UserForm({
  onSubmitForm,
  updating = false,
  userUpdate = null,
  onOpenSnackbar,
}) {
  const [roles, setRoles] = useState([]);
  const [families, setFamilies] = useState([]);
  const [urbanizations, setUrbanizations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({});
  // files
  const [imageProfile, setImageProfile] = useState(null);
  const [carImages, setCarImages] = useState([]);
  const [carPlateImages, setCarPlateImages] = useState([]);

  useEffect(() => {
    if (userUpdate) {
      const imageProfileUser = userUpdate?.images.find(
        (image) => image.type === "profile"
      );
      if (imageProfileUser) setImageProfile({ image: imageProfileUser });

      // Images Car
      const imageCar = userUpdate?.images.find((image) => image.type === "car");
      if (imageCar) setCarImages([{ image: imageCar }]);

      const imageCarPlate = userUpdate?.images.find(
        (image) => image.type === "carPlate"
      );
      if (imageCarPlate) setCarPlateImages([{ image: imageCarPlate }]);
    }
  }, [userUpdate]);

  useEffect(() => {
    setUser(getUserSession());
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.user?.roles.includes("001")) fetchUrbanizations();
    if (user?.user?.roles.includes("002")) fetchFamilies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRoles = async () => {
    const response = await sendRequest(`${urlApi}/roles`, null, "GET", true);
    if (!response.error) {
      if (!response.data?.error) {
        setRoles(response.data?.results?.roles);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const fetchUrbanizations = async () => {
    const response = await sendRequest(
      `${urlApi}/urbanizations`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      if (!response.data?.error) {
        setUrbanizations(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;
        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const fetchFamilies = async () => {
    const response = await sendRequest(`${urlApi}/families`, null, "GET", true);
    if (!response.error) {
      if (!response.data?.error) {
        setFamilies(response.data?.results?.families);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;
        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleChangeProfileUpload = (e) => {
    const maxSizeMB = 5;
    const newImage = e.target?.files?.[0];

    if (parseFloat(newImage?.size / Math.pow(1024, 2)) > maxSizeMB) {
      onOpenSnackbar(
        true,
        `El tamaño de la imágen de perfil no puede ser mayor a ${maxSizeMB} MB`,
        "error"
      );
      e.target.value = null;
      return;
    }
    if (newImage) {
      setImageProfile((previous) => ({
        image: {
          ...previous?.image,
          file: newImage,
          url: URL.createObjectURL(newImage),
        },
      }));
    }

    e.target.value = null;
  };
  const handleClickProfileUpload = (e) => {
    if (imageProfile?.image?.url) {
      e.preventDefault();

      setImageProfile((previous) =>
        !updating
          ? null
          : {
              image: {
                updated: previous.image?.updated ?? previous?.image,
              },
            }
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      updating: updating ?? false,
      idCard: userUpdate?.idCard ?? "",
      username: userUpdate?.username ?? "",
      fullName: userUpdate?.fullName ?? "",
      phone: userUpdate?.details?.phone ?? "",
      email: userUpdate?.email ?? "",
      password: "",
      family:
        families?.filter((family) => userUpdate?.families.includes(family.code)) ??
        [],
      urbanization:
        urbanizations?.urbanizations?.find(
          (urbanization) => urbanization.code === userUpdate?.codeUrbanization
        ) ?? {},

      role: userUpdate?.roles[0] ?? "",

      driver: userUpdate?.details?.driver ?? false,
    },
    enableReinitialize: true,
    validationSchema: UserCreateScheme,

    onSubmit: (values) => {
      // Structure [Keys names] send to api
      const formDataStructure = {
        email: "email",
        username: "username",
        password: "password",
        idCard: "idCard",
        fullName: "fullName",
        role: "codeRole[]",
      };

      const formData = new FormData();

      // Add text changed values
      Object.keys(values).forEach((key) => {
        if (values[key] !== formik.initialValues[key]) {
          if (formDataStructure[key])
            formData.append(formDataStructure[key], values[key]);
        }
      });

      if (
        values.role === "002" &&
        formik.initialValues.urbanization !== values.urbanization
      ) {
        formData.append("codeUrbanization", values.urbanization?.code);
      }
      // if Profile Image is append
      if (imageProfile?.image?.file)
        formData.append("profileImage", imageProfile.image?.file);

      if (imageProfile?.image?.updated)
        formData.append(
          "profileImageUpdated",
          JSON.stringify(imageProfile.image?.updated)
        );

      let details = userUpdate?.details ?? {};

      if (values.phone !== formik.initialValues.phone)
        details = { ...details, phone: values.phone ?? "" };

      if (values.role === "003") {
        details = { ...details, driver: values?.driver };

        if (!updating) {
          formData.append("codeUrbanization", user?.user?.codeUrbanization);
        }

        if (formik.initialValues.family !== values.family)
          values.family.forEach((e) => formData.append("codeFamily[]", e.code));

        if (values?.driver) {
          if (
            carImages.some((carImage) => !!carImage?.image?.url) > 0 &&
            carPlateImages.some((cplateImage) => !!cplateImage?.image?.url) > 0
          ) {
            const carUpdated = [];

            carImages.forEach((e) => {
              if (e?.image?.file) formData.append("car", e?.image?.file);
              if (e?.image?.updated) carUpdated.push(e?.image?.updated);
            });

            if (carUpdated?.length > 0)
              formData.append("carUpdated", JSON.stringify(carUpdated));

            const carPlateUpdated = [];

            carPlateImages.forEach((e) => {
              if (e?.image?.file) formData.append("carPlate", e?.image?.file);
              if (e?.image?.updated) carPlateUpdated.push(e?.image?.updated);
            });

            if (carPlateUpdated?.length > 0)
              formData.append(
                "carPlateUpdated",
                JSON.stringify(carPlateUpdated)
              );
          } else {
            onOpenSnackbar(true, "Ingrese imágenes del carro y placa", "error");
            return;
          }
        }
      }

      if (!updating) {
        formData.append("details", JSON.stringify(details));
      } else {
        const validateChange = Object.keys(details).some(
          (detail) => userUpdate?.details[detail] !== details[detail]
        );

        if (validateChange) formData.append("details", JSON.stringify(details));
      }

      if (Array.from(formData.keys())?.length === 0)
        onOpenSnackbar(true, "No ha realizado modificaciones", "warning");
      else onSubmitForm(formData);
    },
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          border: "1px solid",
          borderColor: grey[300],
          p: 4,
          mt: 2,
          backgroundColor:"white"
        }}
      >
        <Box sx={{ pt: -2, pb:3, pr:4 , pl:4}}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  m: 1,
                }}
              >
                <Link
                  href={imageProfile?.image?.url}
                  target="_blank"
                  rel="noopener"
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={imageProfile?.image?.url || ""}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                </Link>

                <input
                  accept="image/*"
                  hidden
                  id="avatar-image-upload"
                  type="file"
                  onChange={handleChangeProfileUpload}
                />
                <label htmlFor="avatar-image-upload">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    mb={2}
                    onClick={handleClickProfileUpload}
                  >
                    {imageProfile?.image?.url ? (
                      <DeleteIcon mr={2} />
                    ) : (
                      <UploadIcon mr={2} />
                    )}
                    {imageProfile?.image?.url ? "Limpiar" : "Subir"}
                  </Button>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="idCard"
                name="idCard"
                label="Cédula"
                disabled={updating}
                fullWidth
                autoComplete="family-name"
                size="small"
                value={formik.values.idCard}
                onChange={formik.handleChange}
                error={formik.touched.idCard && Boolean(formik.errors.idCard)}
                helperText={formik.touched.idCard && formik.errors.idCard}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="username"
                name="username"
                label="Usuario"
                disabled={updating}
                fullWidth
                autoComplete="given-name"
                size="small"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="fullName"
                name="fullName"
                label="Nombre"
                disabled={updating}
                fullWidth
                autoComplete=""
                size="small"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
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

            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Email"
                fullWidth
                size="small"
                value={formik.values.email}
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
                label="Contraseña"
                fullWidth
                size="small"
                value={formik.values.password}
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
              <FormControl fullWidth size="small">
                <InputLabel id="roleLabel">Rol</InputLabel>

                <Select
                  labelId="role"
                  id="role"
                  name="role"
                  label="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                >
                  {roles?.map((item) => (
                    <MenuItem key={item.id} value={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText error={true}>
                  {formik.touched.role && formik.errors.role}
                </FormHelperText>
              </FormControl>
            </Grid>

            {formik.values.role === "003" && (
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  size="small"
                  id="family"
                  name="family"
                  options={families}
                  isOptionEqualToValue={(option, value) => {
                    return option.code === value.code;
                  }}
                  getOptionLabel={(option) => option.name}
                  value={formik.values.family}
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      "family",
                      value ?? formik.initialValues.family
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      error={
                        formik.touched.family && Boolean(formik.errors.family)
                      }
                      helperText={formik.touched.family && formik.errors.family}
                      {...params}
                      label="Familia"
                      placeholder="-"
                    />
                  )}
                />
              </Grid>
            )}

            {formik.values.role === "002" && (
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  size="small"
                  id="urbanization"
                  name="urbanization"
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code ||
                    Object.keys(value)?.length === 0
                  }
                  options={urbanizations?.urbanizations}
                  getOptionLabel={(option) => option?.name ?? ""} // Requiere un string ('label') para ser mostrado
                  value={formik.values.urbanization}
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      "urbanization",
                      value ?? formik.initialValues.urbanization
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      error={
                        formik.touched.family &&
                        Boolean(formik.errors.urbanization)
                      }
                      helperText={
                        formik.touched.family && formik.errors.urbanization
                      }
                      {...params}
                      label="Urbanización"
                    />
                  )}
                />
              </Grid>
            )}

            {formik.values.role === "003" && (
              <Grid item xs={12} sm={12}>
                <FormGroup>
                  <FormLabel component="legend">Modo conductor</FormLabel>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.driver}
                        // onChange={handleChangeDriverMode}
                        onChange={(e) =>
                          formik.setFieldValue("driver", e.target.checked)
                        }
                      />
                    }
                    label="Activo"
                  />
                </FormGroup>
              </Grid>
            )}

            {formik.values.driver && (
              <>
                <Grid item xs={12} sm={12}>
                  <UploadImagesComponent
                    title={"Automóvil"}
                    images={carImages}
                    setImages={setCarImages}
                    max={1}
                    maxSize={5}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <UploadImagesComponent
                    title={"Placa carro"}
                    images={carPlateImages}
                    setImages={setCarPlateImages}
                    max={1}
                    maxSize={5}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                //fullWidth
              >
                {updating ? "Actualizar" : "Crear"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
