import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Container, Button } from "@mui/material";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import UrbanizationForm from "./UrbanizationForm";
import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Create() {
  const navigate = useNavigate();
  const [urbanization, setUrbanization] = useState({});
  const { id } = useParams();
  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    getUrbanization(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getUrbanization = async (idUrbanization) => {
    const response = await sendRequest(
      `${urlApi}/urbanizations/${idUrbanization}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        //Importtant
        setUrbanization(response);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleSubmit = async (data) => {
    const response = await sendRequest(
      `${urlApi}/urbanizations/${urbanization?.data?.results.urbanization.id}`,
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

        <UrbanizationForm
          onSubmitForm={handleSubmit}
          updating={true}
          urbanizationUpdate={urbanization?.data?.results?.urbanization}
        />
      </Container>
    </>
  );
}
