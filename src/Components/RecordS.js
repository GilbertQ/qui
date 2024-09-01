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
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl
} from '@mui/material';
import format from 'date-fns/format';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';
import { downloadCSV } from './Helpers';
import BTotals from './BTotals';

const categoryOptions = ['Gifts', 'Groceries', 'Eating Out', 'Education', 'Rent / Loan', 'Utilities', 'Car', 'Medical', 'Household', 'Fun', 'Ketzia', 'Marcos', 'Rbk', 'Voluntariado', 'Clothing', 'Transport', 'Parents', 'Crista', 'Taxes', 'Casa-puerto', 'Inversiones', 'Propiedad'];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

const SkullBonesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#FFFFFF" d="M12 2C5.373 2 0 7.373 0 14c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 16c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
    <path fill="#000000" d="M19 15h-4v-3h-2v3h-4v4h4v-1h3v-1h-2v1h4v-4h2V9h-4V7h-2v1H7v4h4v1h2v-1h-2v-4h-2V5h4V3h-4C7 1 0 7 0 14v2h16z" />
  </svg>
);

const RecordS = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('records');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });

  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({
    day: currentDay,
    month: currentMonth,
    year: currentYear,
    category: '',
    price: '',
    note: ''
  });

  useEffect(() => {
    if (editId === null) {
      setFormValues({
        day: currentDay,
        month: currentMonth,
        year: currentYear,
        category: '',
        price: '',
        note: ''
      });
    } else {
      const record = records.find(record => record.id === editId);
      if (record) {
        const date = new Date(record.date);
        setFormValues({
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          category: record.category,
          price: record.price,
          note: record.note
        });
      }
    }
  }, [editId, currentDay, currentMonth, currentYear, records]);

  const handleEdit = (id) => {
    setEditId(id);
  };

  const handleCancel = () => {
    setFormValues({ day: currentDay, month: currentMonth, year: currentYear, category: '', price: '', note: '' });
    setEditId(null);
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
    const newRecord = { id: Date.now(), date, category, price, note };

    const updatedRecords = editId !== null
      ? records.map(record => (record.id === editId ? newRecord : record))
      : [...records, newRecord];

    setRecords(updatedRecords);
    localStorage.setItem('records', JSON.stringify(updatedRecords));
    handleCancel();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (confirmed) {
      const updatedRecords = records.filter(record => record.id !== id);
      setRecords(updatedRecords);
      localStorage.setItem('records', JSON.stringify(updatedRecords));
    }
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

  const handleClearAll = () => {
    const confirmed = window.confirm("really sure?");
    if (confirmed) {
      setRecords([]);
      localStorage.removeItem('records'); // Clears the records from localStorage
    }
  };
  const [selectedOption, setSelectedOption] = useState('D');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [showTotalsSummary, setShowTotalsSummary] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <Container>
      <div>
        <div className="form-container">
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
            startIcon={editId === null ? <AddIcon /> : <CheckIcon />} 
            onClick={handleSave}
            size="small"
            sx={{ 
              minWidth: 'unset', 
              width: 'auto', 
              padding: '6px'
            }}
          >
          </Button>
          {editId !== null && (
            <Button 
              variant="outlined" 
              onClick={handleCancel} 
              size="small"
              sx={{ marginLeft: 1 }}
            >
              Cancel
            </Button>
          )}
          <Button 
            variant="contained" 
            onClick={() => downloadCSV({records})} 
            style={{ minWidth: 'auto' }}
          >
            <span className="button-content">⇓</span>
          </Button>

          {showDetails && (
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              variant="outlined"
              size="small"
              style={{ minWidth: 'auto' }}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="D">D</MenuItem>
            </Select>
          )}

        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <FormControlLabel
    control={
      <Checkbox
        checked={showDetails}
        onChange={(e) => setShowDetails(e.target.checked)}
      />
    }
    label="Details"
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={showTotalsSummary}
        onChange={(e) => setShowTotalsSummary(e.target.checked)}
      />
    }
    label="Summary"
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={showChart}
        onChange={(e) => setShowChart(e.target.checked)}
      />
    }
    label="Chart"
  />
  <Button
    variant="outlined"
    onClick={handleClearAll}
    style={{ minWidth: 'auto', marginTop: '0' }} // Remove unnecessary margin
  >
    <SkullBonesIcon />
  </Button>
</div>
        {showTotalsSummary && (
          <TotalsSummary totalDays={totalDays} totalPrice={totalPrice} />
        )}
      </div>
      {showChart && (
        <div>
          {BTotals({records})}
        </div>
      )}
      {showDetails && (
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
              {records
                .filter(record => {
                  if (selectedOption === 'D') {
                    const selectedDate = new Date(formValues.year, formValues.month - 1, formValues.day);
                    const recordDate = new Date(record.date);

                    return (
                      recordDate.getDate() === selectedDate.getDate() &&
                      recordDate.getMonth() === selectedDate.getMonth() &&
                      recordDate.getFullYear() === selectedDate.getFullYear()
                    );
                  }
                  return true; // If selectedOption is not 'D', include all records
                })
                .map((record) => (
                  <TableRow key={record.id}> {/* Use record.id as key */}
                    <TableCell>{format(new Date(record.date), 'yyyy.MM.dd')}</TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>{record.price}</TableCell>
                    <TableCell>{record.note}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(record.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(record.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default RecordS;

