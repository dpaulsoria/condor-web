import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Container, Button, Stack , Typography, Icon} from "@mui/material";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import UserForm from "./UserForm";
import { useState } from "react";
import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Create() {
  const navigate = useNavigate();

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  const onSubmitForm = async (data) => {
    const response = await sendRequest(
      `${urlApi}/users`,
      data,
      "POST",
      true,
      true
    );

    if (!response.error) {
      if (!response.data?.error) {
        navigate("../", { replace: true });
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) ||
          response.data?.message;

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
          mb={3}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }} gutterBottom>
            Datos de usuario
          </Typography>
          <Button
            variant="contained"
            // color="error"
            component={RouterLink}
            to="../"
          >
            Regresar
          </Button>
        </Stack>

        <UserForm
          onSubmitForm={onSubmitForm}
          onOpenSnackbar={(opened, message, type) =>
            onOpenSnackbar(opened, message, type)
          }
        />
      </Container>
    </>
  );
}
