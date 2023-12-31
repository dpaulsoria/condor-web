import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Link, Drawer, Typography, Avatar } from "@mui/material";
// components
import Logo from "../../components/app/Logo";
import Scrollbar from "../../components/app/Scrollbar";
import NavSection from "../../components/app/NavSection";
import { MHidden } from "../../components/@material-extend";
//
import sidebarConfig from "./SidebarConfig";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[300],
  
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
  user = {},
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderUserRoleText = () => { 
    const roleUser = user?.user?.roles[0];
    if (roleUser === "001") return "Super-Administrador";
    else if (roleUser === "002") return "Administrador";
    else if (roleUser === "003") return "Usuario";
    else return "-";
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1B2144" 
        },
      }}
    >
      <Box sx={{ px: 3, py: 3}}>
        <Box component={RouterLink} to="/" sx={{ display: "inline-flex" }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5}}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle >
            <Avatar
              src={"/static/mock-images/avatars/avatar_default.jpg"}
              alt="photoURL"
            />
            <Box sx={{ ml: 2}}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {user?.user?.username}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {renderUserRoleText()}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box >

      <NavSection navConfig={sidebarConfig} sx={{ backgroundColor: "#1B2144" }}/>

      <Box sx={{ flexGrow: 1, backgroundColor: "#1B2144" }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
