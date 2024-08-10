import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BTotals = ({ records }) => {
  console.log("BTotalsDebug function called");
  // Aggregate totals by category
  const totalsByCategory = records.reduce((acc, record) => {
    acc[record.category] = (acc[record.category] || 0) + record.price;
    return acc;
  }, {});

  // Aggregate totals by day
  const totalsByDay = records.reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + record.price;
    return acc;
  }, {});

  // Prepare data for the category chart
  const categoryChartData = {
    labels: Object.keys(totalsByCategory),
    datasets: [
      {
        label: 'Total by Category',
        data: Object.values(totalsByCategory),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for the day chart
  const dayChartData = {
    labels: Object.keys(totalsByDay),
    datasets: [
      {
        label: 'Total by Day',
        data: Object.values(totalsByDay),
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


