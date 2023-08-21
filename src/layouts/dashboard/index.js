import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
//
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

// ----------------------------------------------------------------------

import { getUserSession } from "../../utils/utils";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  // Auth
  const auth = getUserSession();

  return auth ? (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} user={auth} />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        user={auth}
      />
      <MainStyle
      sx={{
        backgroundColor: "#F2F6FC",
      }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  ) : (
    <Navigate to="/login" />
  );
}
