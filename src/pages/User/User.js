import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";

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

import TableMoreMenu from "../../components/_dashboard/TableMoreMenu";
import Page from "../../components/app/Page";
import { urlApi } from "../../utils/constants";
import { getUserSession, sendRequest } from "../../utils/utils";
import CustomSnackbar from "../../components/app/CustomSnackbar";

export default function User() {
  const navigate = useNavigate();
  const auth = getUserSession();
  const [users, setUsers] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

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
    fetchUsers(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchUsers = async (pages, row, searchFilter) => {
    const condition = searchFilter ? `&search=${searchFilter}` : "";

    const response = await sendRequest(
      `${urlApi}/users?page=${pages}&size=${row}${condition}`,
      null,
      "GET",
      true
    );

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        setUsers(response.data?.results);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      if (response.redirect) navigate("/login", { replace: true });
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleDeleteUser = async () => {
    const response = await sendRequest(
      `${urlApi}/users/${selectedUser?.id}`,
      null,
      "DELETE",
      true
    );

    setDeleteDialog(false);

    if (!response.error) {
      //Response API
      if (!response.data?.error) {
        fetchUsers(page, rowsPerPage);
      } else {
        const errorMessage =
          response.data?.errors?.map((e) => `-${e}\n`) || response.data.message;

        onOpenSnackbar(true, errorMessage, "error");
      }
    } else {
      onOpenSnackbar(true, response.message, "error");
    }
  };

  const handleFilterSearch = (searchFilter) => {
    fetchUsers(page, rowsPerPage, searchFilter);
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
        Está seguro de eliminar el usuario "{selectedUser?.username}"?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Si da click en 'aceptar', el usuario se eliminará de manera definitiva
          y no se podrán revertir los cambios.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
        <Button onClick={handleDeleteUser} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Page title="Usuario">
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
            Usuarios
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="create"
            startIcon={<Icon icon={plusFill} />}
          >
            Crear
          </Button>
        </Stack>
        {/* Content */}
        
        <SearchBar onFetchData={handleFilterSearch} />
        <Card>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#1B2144" }}>
                <TableRow>
                  {[
                    "ID", "Nombre", "Usuario", "Cédula", "Email", "Urbanizacion"
                  ].map((label) => (
                    <TableCell key={label} sx={{ color: "white" }}>
                      {label}
                    </TableCell>
                  ))}
                  {auth?.user?.roles[0] === "002" && (
                    <TableCell>Familia</TableCell>
                  )}
                  <TableCell>{}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.users?.map((row) => (
                  <TableRow
                  hover
                  key={row.id}
                  sx={{ 
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {backgroundColor: "rgba(250, 187, 63, 0.50) !important" },

                  }}
                >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.username}
                    </TableCell>
                    <TableCell>{row.idCard}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      {row?.codeUrbanization ?? "super-admin"}
                    </TableCell>
                    {auth?.user?.roles[0] === "002" && (
                      <TableCell>
                        {row?.Families?.map(
                          (g, i) =>
                            `${g.name}${
                              i < row?.Families?.length - 1 ? ", " : ""
                            }`
                        )}
                      </TableCell>
                    )}

                    <TableCell>
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
            count={users?.pagination?.totalItems ?? 0}
            page={page}
            labelRowsPerPage={"Items por página"}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Confirm delete dialog */}
        {ConfirmDelete}
      </Container>
    </Page>
  );
}
