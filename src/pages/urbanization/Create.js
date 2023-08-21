import { Container, Button , Stack, Typography} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import OrganizationForm from "./UrbanizationForm";
import CustomSnackbar from "../../components/app/CustomSnackbar";
import { useState } from "react";

export default function Create() {
  const navigate = useNavigate();

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  const handleSubmit = async (data) => {
    const response = await sendRequest(
      `${urlApi}/urbanizations`,
      data,
      "POST",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        navigate("../", { replace: true });
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;
        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }} gutterBottom>
            Crear Urbanización
          </Typography>
          <Button variant="contained" component={RouterLink} to="../">
          Regresar
        </Button>
        </Stack>
        <OrganizationForm onSubmitForm={handleSubmit} />
      </Container>
    </>
  );
}
