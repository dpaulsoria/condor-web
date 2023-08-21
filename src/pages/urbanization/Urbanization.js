import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";

// material
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

import TableMoreMenu from "../../components/_dashboard/TableMoreMenu";
import { urlApi } from "../../utils/constants";
import { sendRequest } from "../../utils/utils";
import SearchBar from "../../components/SearchBarTable";
import Page from "../../components/app/Page";
import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function Urbanization() {
  const [urbanizations, setUrbanizations] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUrbanization, setSelectedUrbanization] = useState({});

  // Pag
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
    fetchUrbanizations(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchUrbanizations = async (pages, row, filterSearch) => {
    const condition = filterSearch ? `&search=${filterSearch}` : "";

    const response = await sendRequest(
      `${urlApi}/Urbanizations?page=${pages}&size=${row}${condition}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
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

  const handleOpenDeleteDialog = (urbanization) => {
    setSelectedUrbanization(urbanization);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleDeleteUrbanization = async () => {
    const response = await sendRequest(
      `${urlApi}/urbanizations/${selectedUrbanization?.id}`,
      null,
      "DELETE",
      true
    );

    setDeleteDialog(false);

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        fetchUrbanizations(page, rowsPerPage);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;
        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleFilterSearch = (filterSearch) => {
    fetchUrbanizations(page, rowsPerPage, filterSearch);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ConfirmDelete = (
    <Dialog
      open={deleteDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Está seguro de eliminar la ubanización "{selectedUrbanization?.name}"?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Si da click en 'aceptar', el grupo se eliminará de manera definitiva y
          no se podrán revertir los cambios.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
        <Button onClick={handleDeleteUrbanization} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Page title="Urbanización">
        <Container>
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
            <Typography variant="h4" gutterBottom>
              Urbanizaciones
            </Typography>
            <Button
              // color="secondary"
              variant="contained"
              component={RouterLink}
              to="create"
              startIcon={<Icon icon={plusFill} />}
            >
              Crear
            </Button>
          </Stack>
            <SearchBar onFetchData={handleFilterSearch} />
          <Card >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: "#1B2144" }}>
                  <TableRow>
                    {["ID", "Código", "Nombre", "Dirección", "Opciones"].map((label) => (
                      <TableCell key={label} sx={{ color: "white" }}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urbanizations?.urbanizations?.map((row) => (
                    <TableRow hover
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {backgroundColor: "rgba(250, 187, 63, 0.50) !important" },
                      }}  
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell component="th" scope="row">
                        {row.code}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.address}</TableCell>

                      <TableCell style={{ width: 40 }} align="right">
                        <TableMoreMenu
                          onDelete={() => handleOpenDeleteDialog(row)}
                          updateLink={`update/${row.id}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={urbanizations?.pagination?.totalItems ?? 0}
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
    </>
  );
}
