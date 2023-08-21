/** @format */

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";

import {
  Stack,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  TablePagination,
  Card,
} from "@mui/material";

import SearchBar from "../../components/SearchBarTable";
import MonthBar from "../../components/MonthBarTable";

import TableMoreMenu from "../../components/_dashboard/TableMoreMenu";

import Page from "../../components/app/Page";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";

import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Families() {
  const [families, setFamilies] = useState([]);
  const [valuesPerMonth, setValuesPerMonth] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState({});

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [snackBar, setSnackBar] = useState({});

  const onOpenSnackbar = (opened, message, type) => {
    setSnackBar({ opened, message, type });
  };

  const onCloseSnackbar = () => {
    setSnackBar({});
  };

  useEffect(() => {
    fetchFamilies(page, rowsPerPage);
    fetchValuesPerMonth(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchFamilies = async (pages, row, filterSearch) => {
    const condition = filterSearch ? `&search=${filterSearch}` : "";

    const response = await sendRequest(
      `${urlApi}/families?page=${pages}&size=${row}${condition}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        setFamilies(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const fetchValuesPerMonth = async (pages, row, filterSearch) => {
    const condition = filterSearch ? `&search=${filterSearch}` : "";

    const response = await sendRequest(
      `${urlApi}/valuesPerMonth?page=${pages}&size=${row}${condition}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        setValuesPerMonth(response.data?.results);
        console.log(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleOpenDeleteDialog = (family) => {
    setSelectedFamily(family);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterSearch = (filterSearch) => {
    fetchValuesPerMonth(page, rowsPerPage, filterSearch);
  };

  const handleDeleteFamily = async () => {
    const response = await sendRequest(
      `${urlApi}/families/${selectedFamily.id}`,
      null,
      "DELETE",
      true
    );

    setDeleteDialog(false);

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        fetchFamilies(page, rowsPerPage);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const ConfirmDelete = (
    <Dialog
      open={deleteDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Está seguro de eliminar la familia "{selectedFamily?.name}"?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Si da click en 'aceptar', la familia se eliminará de manera definitiva
          y no se podrán revertir los cambios.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
        <Button onClick={handleDeleteFamily} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Page title="Familias">
      <Container>
        <CustomSnackbar
          stateSnackbar={snackBar}
          onCloseSnackbar={() => onCloseSnackbar}
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Familias
          </Typography>
          <Button
            component={RouterLink}
            to="create"
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
          >
            Crear
          </Button>
        </Stack>
        {/* Content */}

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SearchBar onFetchData={handleFilterSearch} />
            <MonthBar />
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Alicuota</TableCell>
                  <TableCell>Carreras Solicitadas</TableCell>
                  <TableCell>Carreras Realizadas</TableCell>
                  <TableCell>Total a Pagar</TableCell>
                  <TableCell>Saldo a favor</TableCell>
                  <TableCell>Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {families?.families?.map((row) => {
                  const matchingValue = valuesPerMonth?.valuesPerMonth?.find(
                    (row2) => row2.familyCode === row.code
                  );
                  const payPassengerValue = matchingValue
                    ? matchingValue.payPassenger
                    : 0;
                  const payDriverValue = matchingValue
                    ? matchingValue.payDriver
                    : 0;
                  const payTotalValue = matchingValue
                    ? matchingValue.payvalue
                    : 0;

                  return (
                    <TableRow
                      hover
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell component="th" scope="row">
                        {row.code}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>${row.aliquot}</TableCell>
                      <TableCell>${payPassengerValue}</TableCell>
                      <TableCell>${payDriverValue}</TableCell>
                      <TableCell>
                        {payTotalValue > 0 ? `$${payTotalValue}` : "0"}
                      </TableCell>
                      <TableCell>
                        {payTotalValue < 0
                          ? `$${Math.abs(payTotalValue)}`
                          : "0"}
                      </TableCell>

                      <TableCell style={{ width: 40 }} align="left">
                        <TableMoreMenu
                          onDelete={() => handleOpenDeleteDialog(row)}
                          updateLink={`update/${row.id}`}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={families?.pagination?.totalItems ?? 0}
            page={page}
            labelRowsPerPage={"Items por página"}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {ConfirmDelete}
      </Container>
    </Page>
  );
}
