import PropTypes from "prop-types";
// material
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  return (
    <Box
      component="img"
      src="/static/_condor_logo.png"
      sx={{ width: 230, height: 70, ...sx }}
    />
  );
}
