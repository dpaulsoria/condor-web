import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Toolbar, Select, MenuItem } from "@mui/material";

const backgroundStyle = {
  background: "rgb(230, 246, 255)",
  boxShadow: "0px 4px 20px 0px rgba(26, 54, 126, 0.1)",
};

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1, 0, 3),
}));

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const years = [2022, 2021, 2020, 2019, 2018, 2017];

export default function MonthSelector({ onFetchData }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    onFetchData(selectedYear, event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    onFetchData(event.target.value, selectedMonth);
  };

  return (
    <RootStyle>
      <Box sx={{ mr: 3, flex: "0 0 30%" }}>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          displayEmpty
          inputProps={{ "aria-label": "Mes" }}
        >
          <MenuItem value="" disabled>
            Mes
          </MenuItem>
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          displayEmpty
          inputProps={{ "aria-label": "Año" }}
        >
          <MenuItem value="" disabled>
            Año
          </MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </RootStyle>
  );
}
