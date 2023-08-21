
import { TextField, Box, Grid, Typography, Button,FormControlLabel,
  FormLabel,
  FormFamily,Switch,
  } from "@mui/material";
import { useState } from "react";
import { grey } from "@mui/material/colors";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validationErrors } from "../../utils/constants";

const FamilyFormScheme = Yup.object().shape({
  code: Yup.string()
    .max(25, validationErrors.family.code.max)
    .required(validationErrors.family.code.required),
  name: Yup.string()
    .max(75, validationErrors.family.name.max)
    .required(validationErrors.family.name.required),
  address: Yup.string()
    .max(100, validationErrors.family.address.max)
    .required(validationErrors.family.address.required),
    aliquot: Yup.number()
    .when("includeAlicuota", {
      is: true,
      then: Yup.number().required(validationErrors.family.aliquot.required),
      otherwise: Yup.number(),
    }),

});

export default function FamilyForm({ onSubmitForm, updating, familyUpdate }) {

  
  const formik = useFormik({
    initialValues: {
      code: familyUpdate?.code ?? "",
      name: familyUpdate?.name ?? "",
      address: familyUpdate?.address ?? "",
      aliquot: familyUpdate?.aliquot ?? "",
      includeAlicuota: false,
    },
    enableReinitialize: true,
    validationSchema: FamilyFormScheme,

    onSubmit: (values) => {
      const dataFamily = {
        ...(!updating && { code: values.code }),
        name: values.name,
        address: values.address,
        aliquot: values.includeAlicuota ? values.aliquot : null,
      };

      onSubmitForm(dataFamily);
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
          mt: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Crear familia
        </Typography>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={updating}
                id="code"
                name="code"
                label="Código"
                fullWidth
                autoComplete="family-name"
                size="small"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="name"
                name="name"
                label="Nombre"
                fullWidth
                autoComplete="given-name"
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                id="address"
                name="address"
                label="Dirección"
                fullWidth
                autoComplete=""
                size="small"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.includeAlicuota}
                    onChange={formik.handleChange}
                    name="includeAlicuota"
                    color="primary"
                  />
                }
                label="Incluir alicuota"
              />
            </Grid>

            {formik.values.includeAlicuota && (
              <Grid item xs={12} sm={6}>
                <TextField
                  id="aliquot"
                  name="aliquot"
                  label="Alicuota"
                  fullWidth
                  autoComplete="off"
                  size="small"
                  value={formik.values.aliquot}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.aliquot && Boolean(formik.errors.aliquot)
                  }
                  helperText={formik.touched.aliquot && formik.errors.aliquot}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
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
