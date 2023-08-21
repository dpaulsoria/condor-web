import { Container, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import FamilyForm from "./FamilyForm";
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
    const response = await sendRequest(`${urlApi}/families`, data, "POST", true);

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

        <Button variant="contained" component={RouterLink} to="../">
          Regresar
        </Button>

        <FamilyForm
          onSubmitForm={handleSubmit}
        />
      </Container>
    </>
  );
}
