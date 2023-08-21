import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import homeFill from "@iconify/icons-eva/home-fill";
import personFill from "@iconify/icons-eva/person-fill";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// material
import { alpha } from "@mui/material/styles";
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
// components
import MenuPopover from "../../components/app/MenuPopover";
//

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Inicio",
    icon: homeFill,
    linkTo: "/",
  },
  {
    label: "Perfil",
    icon: personFill,
    linkTo: "profile",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ user }) {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    localStorage.removeItem("sesion");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar
          src={"/static/mock-images/avatars/avatar_default.jpg"}
          alt="photoURL"
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220,}}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.user?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary"}} noWrap>
            {user?.user?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: "body2", py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
              }}
            />

            {option.label}
          </MenuItem>
        ))}

      <Box sx={{ p: 2, pt: 1.5 }}>
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              onClick={logOut}
              sx={{
                backgroundColor: 'transparent',
                color: '#1B2144',
                border: '1px solid #1B2144',
                '&:hover': {
                  backgroundColor: '#1B2144',
                  color: '#FABB3FEB',
                },
              }}
            >
              Salir
            </Button>
          </Box>
      </MenuPopover>
    </>
  );
}
