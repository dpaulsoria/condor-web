import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DriveEtaIcon from '@mui/icons-material/DriveEta';


// import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
// ----------------------------------------------------------------------

const sidebarConfig = [
  {
    title: "Inicio",
    path: "/dashboard/Home",
    icon: <DashboardIcon />,
    role: ["001", "002"],
  },
  {
    title: "Usuarios",
    path: "/dashboard/users",
    icon: <PeopleAltIcon />,
    role: ["001", "002"],
  },
  {
    title: "Familias",
    path: "/dashboard/families",
    icon: <GroupsIcon />,
    role: ["002"],
  },
  {
    title: "Urbanizaciones",
    path: "/dashboard/urbanizations",
    icon: <AccountBalanceIcon />,
    role: ["001"],
  },
  {
    title: "Detalles de Carreras",
    path: "/dashboard/payments",
    icon: <DriveEtaIcon />,
    role: ["002"],
  },
];

export default sidebarConfig;
