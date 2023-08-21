import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Container, Button } from "@mui/material";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import UserForm from "./UserForm";
import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Update() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { id } = useParams();

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    getUser(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getUser = async (idUser) => {
    const response = await sendRequest(
      `${urlApi}/users/${idUser}`,
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
      `${urlApi}/users/${user?.user?.id}`,
      data,
      "PUT",
      true,
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

        <Button variant="contained" component={RouterLink} to="../">
          Regresar
        </Button>
        <UserForm
          onSubmitForm={onSubmitForm}
          updating={true}
          userUpdate={user?.user}
          onOpenSnackbar={(opened, message, type) =>
            onOpenSnackbar(opened, message, type)
          }
        />
      </Container>
    </>
  );
}
