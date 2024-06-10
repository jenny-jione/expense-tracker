// 누적 막대 그래프
// src/App.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse';
import { categoryColors } from './constants';

Chart.register(...registerables);

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const formattedData = result.data
            .filter(row => Object.values(row).some(value => value.trim() !== '')) // 빈 줄 제거
            .map(row => ({
              month: row.Month,
              category: row.Category,
              amount: parseFloat(row.Amount),
            }));
            setData(formattedData);
            console.log(formattedData); // 데이터 출력
          }
        });
      })
      .catch(error => console.error('Error fetching the CSV file:', error));
  }, []);


  ////
  const getChartData = () => {
    const months = [...new Set(data.map(item => item.month))];
    const categories = [...new Set(data.map(item => item.category))];

    // 월별 카테고리 데이터를 집계
    const monthlyData = months.map(month => {
      const filteredData = data.filter(item => item.month === month);
      const categoryAmounts = categories.map(category => ({
        category,
        amount: filteredData
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + item.amount, 0),
      }));
      // 금액 기준으로 오름차순 정렬
      categoryAmounts.sort((a, b) => b.amount - a.amount);
      console.log(categoryAmounts);
      return { month, categoryAmounts };
    });

    // 차트를 위해 정렬된 카테고리 순서대로 데이터셋을 생성
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
  //////








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
      }
    }
  };

  return (
    <div>
      <h1>Monthly Expense Tracker</h1>
      {data.length > 0 && <Bar data={getChartData()} options={options} />}
    </div>
  );
};

export default App;