import { useState, React } from "react";

import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  OutlinedInput,
  IconButton,
} from "@mui/material";

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  backgroundColor: "#FFFFFF",
  "&.Mui-focused": { boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500]} !important`,
  },
}));

export default function UserSearchBar({ onFetchData }) {
  const [filter, setFilter] = useState("");

  const handleFilterByName = (event) => {
    setFilter(event.target.value);
  };

  return (
    <RootStyle>
      <SearchStyle
        value={filter}
        onChange={handleFilterByName}
        onKeyPress={(e) => {
          if (e.key === "Enter") onFetchData(filter);
        }}
        placeholder="Buscar..."
        endAdornment={
          <IconButton position="end" onClick={() => onFetchData(filter)}>
            <Box
              component={Icon}
              icon={searchFill}
              sx={{ color: "text.primary" }}
            />
          </IconButton>
        }
      />
    </RootStyle>
  );
}
