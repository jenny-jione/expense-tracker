// BarChartPage.js
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { categoryColors } from './constants';
import useFetchData from './useFetchData';

Chart.register(...registerables);

const BarChartPage = () => {
  const { data, error } = useFetchData('/data.csv');

  const getChartData = () => {
    const months = [...new Set(data.map(item => item.month))];
    const categories = [...new Set(data.map(item => item.category))];

    const monthlyData = months.map(month => {
      const filteredData = data.filter(item => item.month === month);
      const categoryAmounts = categories.map(category => ({
        category,
        amount: filteredData
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + item.amount, 0),
      }));
      categoryAmounts.sort((a, b) => b.amount - a.amount);
      return { month, categoryAmounts };
    });

    const datasets = categories.map(category => {
      return {
        label: category,
        data: months.map(month => {
          const monthData = monthlyData.find(md => md.month === month);
          const categoryData = monthData.categoryAmounts.find(ca => ca.category === category);
          return categoryData ? categoryData.amount : 0;
        }),
        backgroundColor: categoryColors[category],
      };
    });

    return {
      labels: months,
      datasets: datasets,
    };
  };

  const chartData = useMemo(() => getChartData(), [data]);

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat().format(context.raw);
            label += '원';
            return label;
          }
        }
      },
      datalabels: {
        display: false
      }
    }
  };

  return (
    <div>
      <h1>Monthly Expense Tracker</h1>
      {error && <div className="error-message">{error}</div>}
      {data.length > 0 ? <Bar data={chartData} options={options} /> : <p>Loading data...</p>}
    </div>
  );
};

export default BarChartPage;
