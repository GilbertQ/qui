import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BTotals = ({ records }) => {
  // Aggregate totals by category
  const totalsByCategory = records.reduce((acc, record) => {
    const price = parseFloat(record.price) || 0;
    acc[record.category] = (acc[record.category] || 0) + price;
    return acc;
  }, {});

  // Aggregate totals by day
  const totalsByDay = records.reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString();
    const price = parseFloat(record.price) || 0;
    acc[date] = (acc[date] || 0) + price;
    return acc;
  }, {});

  // Convert aggregated totals to fixed-point numbers
  let formattedTotalsByCategory = Object.fromEntries(
    Object.entries(totalsByCategory).map(([key, value]) => [key, value.toFixed(2)])
  );

  let formattedTotalsByDay = Object.fromEntries(
    Object.entries(totalsByDay).map(([key, value]) => [key, value.toFixed(2)])
  );

  // Sort totals by category in descending order by total
  formattedTotalsByCategory = Object.fromEntries(
    Object.entries(formattedTotalsByCategory)
      .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a))
  );

  // Sort totals by day in ascending order by date
  formattedTotalsByDay = Object.fromEntries(
    Object.entries(formattedTotalsByDay)
      .sort(([a], [b]) => new Date(a) - new Date(b))
  );

  const categoryChartData = {
    labels: Object.keys(formattedTotalsByCategory),
    datasets: [
      {
        label: 'Total by Category',
        data: Object.values(formattedTotalsByCategory),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const dayChartData = {
    labels: Object.keys(formattedTotalsByDay),
    datasets: [
      {
        label: 'Total by Day',
        data: Object.values(formattedTotalsByDay),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '45%' }}>
        <Line data={categoryChartData} />
      </div>
      <div style={{ width: '45%' }}>
        <Line data={dayChartData} />
      </div>
    </div>
  );
};

export default BTotals;