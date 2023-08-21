import { useEffect, useState, forwardRef } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomSnackbar({ stateSnackbar, onCloseSnackbar }) {
  const [open, setOpen] = useState({});

  useEffect(() => {
    setOpen(stateSnackbar);
  }, [stateSnackbar]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({});
    onCloseSnackbar();
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open?.opened ?? false}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {["error", "info", "success", "warning"].includes(open.type ?? "") ? (
          <Alert
            onClose={handleClose}
            severity={open.type}
            sx={{ width: "100%" }}
          >
            {open?.message ?? ""}
          </Alert> 
        ) : null}
      </Snackbar>
    </>
  );
}
