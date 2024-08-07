import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import format from 'date-fns/format';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { saveAs } from 'file-saver';
import { Typography } from '@mui/material';

const categoryOptions = ['Gifts', 'Groceries', 'Eating Out', 'Education', 'Rent / Loan', 'Utilities', 'Car', 'Medical', 'Household', 'Fun', 'Ketzia', 'Marcos', 'Rbk', 'Voluntariado', 'Clothing', 'Transport', 'Parents', 'Crista', 'Taxes', 'Casa-puerto', 'Inversiones', 'Propiedad'];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

const RecordS = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('records');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });
  const [editIndex, setEditIndex] = useState(null);
  const [formValues, setFormValues] = useState({
    day: currentDay,
    month: currentMonth,
    year: currentYear,
    category: '',
    price: '',
    note: ''
  });

  useEffect(() => {
    if (editIndex === null) {
      setFormValues({
        day: currentDay,
        month: currentMonth,
        year: currentYear,
        category: '',
        price: '',
        note: ''
      });
    }
  }, [editIndex, currentDay, currentMonth, currentYear]);

  const handleEdit = (index) => {
    const record = records[index];
    const date = new Date(record.date);
    setFormValues({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      category: record.category,
      price: record.price,
      note: record.note
    });
    setEditIndex(index);
  };

  const handleCancel = () => {
    setFormValues({ day: currentDay, month: currentMonth, year: currentYear, category: '', price: '', note: '' });
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { day, month, year, category, price, note } = formValues;

    if (!category || !price || isNaN(price) || price <= 0) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const date = new Date(year, month - 1, day);
    const newRecord = { date, category, price, note };

    let updatedRecords;
    if (editIndex !== null) {
      updatedRecords = [...records];
      updatedRecords[editIndex] = newRecord;
      setEditIndex(null);
    } else {
      updatedRecords = [...records, newRecord];
    }

    setRecords(updatedRecords);
    localStorage.setItem('records', JSON.stringify(updatedRecords));
    handleCancel();
  };

  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
    localStorage.setItem('records', JSON.stringify(updatedRecords));
  };

  const downloadCSV = () => {
    if (records.length === 0) return;

    const csv = records.map(record => ({
      date: format(new Date(record.date), 'yyyy.MM.dd'),
      category: record.category,
      price: record.price,
      note: record.note
    }));

    const rows = csv.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const now = new Date();
    const filename = format(now, 'yyyyMMddHHmmss') + '.csv';
    saveAs(blob, filename);
  };

  const calculateTotals = (records) => {
    const uniqueDays = new Set(records.map(record => format(new Date(record.date), 'yyyy-MM-dd')));
    const totalDays = uniqueDays.size;
    const totalPrice = records.reduce((sum, record) => sum + parseFloat(record.price), 0);
    return { totalDays, totalPrice };
  };

  const { totalDays, totalPrice } = calculateTotals(records);

  const TotalsSummary = ({ totalDays, totalPrice }) => (
    <Paper style={{ padding: '16px', marginTop: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body1">{totalDays} days</Typography>
        <Typography variant="body1">Q.{totalPrice.toFixed(2)}</Typography>
      </div>
    </Paper>
  );

  return (
    <Container>
     <div>
  <div className="form-container">
  <Button variant="contained" onClick={downloadCSV} style={{ minWidth: 'auto' }}>
    <span className="button-content">⇓</span>
</Button>
    <FormControl>
      <InputLabel>Day</InputLabel>
      <Select
        value={formValues.day}
        onChange={handleChange}
        name="day"
      >
        {days.map(day => (
          <MenuItem key={day} value={day}>
            {day}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl>
      <InputLabel>Month</InputLabel>
      <Select
        value={formValues.month}
        onChange={handleChange}
        name="month"
      >
        {months.map(month => (
          <MenuItem key={month} value={month}>
            {month}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl>
      <InputLabel>Year</InputLabel>
      <Select
        value={formValues.year}
        onChange={handleChange}
        name="year"
      >
        {years.map(year => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      select
      label="Category"
      name="category"
      value={formValues.category}
      onChange={handleChange}
      style={{ width: '120px' }}
    >
      {categoryOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
    <TextField
      label="Price"
      name="price"
      type="number"
      value={formValues.price}
      onChange={handleChange}
      style={{ width: '100px' }}
      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
    />
    <TextField
      label="Note"
      name="note"
      value={formValues.note}
      onChange={handleChange}
      inputProps={{ maxLength: 50 }}
      style={{ width: '200px' }}
    />
<Button 
  variant="contained" 
  startIcon={editIndex === null ? <AddIcon /> : <CheckIcon />} 
  onClick={handleSave}
  size="small"
  sx={{ 
    minWidth: 'unset', 
    width: 'auto', 
    padding: '6px'
  }}
>
</Button>
{editIndex !== null && (
  <Button 
    variant="outlined" 
    onClick={handleCancel} 
    size="small"
    sx={{ marginLeft: 1 }}
  >
    Cancel
  </Button>
)}
  </div>
  <TotalsSummary totalDays={totalDays} totalPrice={totalPrice} />
</div>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(record.date), 'yyyy.MM.dd')}</TableCell>
                <TableCell>{record.category}</TableCell>
                <TableCell>{record.price}</TableCell>
                <TableCell>{record.note}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default RecordS;
