import { useState } from 'react';
import { Box, Button, ClickAwayListener, MenuItem, Select, Slide } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Input,
  Slide,
  Button,
  InputAdornment,
  ClickAwayListener,
  IconButton,
} from '@mui/material';

// ----------------------------------------------------------------------

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const Monthbar = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].value);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <Button onClick={handleOpen}>
            {MONTHS.find((month) => month.value === selectedMonth).label}
          </Button>
        )}

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <Box sx={{ position: 'absolute', top: 64, width: '100%' }}>
            <Select value={selectedMonth} onChange={handleMonthChange} fullWidth>
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Slide>
      </div>
    </ClickAwayListener>
  );
};

export default Monthbar;