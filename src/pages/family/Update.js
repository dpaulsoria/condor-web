import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Container, Button } from "@mui/material";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import FamilyForm from "./FamilyForm";

import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Update() {
  const navigate = useNavigate();
  const [family, setFamily] = useState({});
  const { id } = useParams();

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    getFamily(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getFamily = async (idFamily) => {

    const response = await sendRequest(
      `${urlApi}/families/${idFamily}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        //Importtant
        setFamily(response.data?.results?.family);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const obSubmitForm = async (data) => {
    const response = await sendRequest(
      `${urlApi}/families/${family?.id}`,
      data,
      "PUT",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        navigate("../", { replace: true });
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;
        alert(errorMessage);
      }
    } else {
      alert(response.message);
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
          onSubmitForm={obSubmitForm}
          familyUpdate={family}
          updating={true}
        />
      </Container>
    </>
  );
}
