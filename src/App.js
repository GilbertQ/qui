import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import RecordS from './Components/RecordS';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RecordS></RecordS>
    </LocalizationProvider>
  );
};

export default App;

