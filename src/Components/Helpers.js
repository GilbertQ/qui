import { saveAs } from 'file-saver';
import format from 'date-fns/format';

export const downloadCSV = ({records}) => {
    console.log({records})
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