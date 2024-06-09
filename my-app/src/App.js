// import React, { useState, useEffect } from 'react';
// import CSVReader from 'react-csv-reader';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// import './App.css';

// const CATEGORY_COLORS = {
//   식비: '#5FB43D',
//   외식: '#F8D89E',
//   통신비: '#76ADD2',
//   교통: '#598FB0',
//   생필품: '#A7C6D0',
//   생활용품: '#79B0C1',
//   미용: '#F1B6D5',
//   의류잡화: '#F8D9DE',
//   자기계발: '#D6D6D6',
//   웹결제: '#B596C4',
//   문화생활: '#D6BCA2',
//   문구: '#C0E59D',
//   건강관리: '#D6D6D6',
//   의료: '#B4EEEB',
//   친목: '#F1A3C7',
//   선물: '#D6D6D6',
//   가족: '#FFABB9',
//   경조사: '#8D7668',
//   여행: '#42906D',
//   기타: '#D6D6D6',
//   Other: '#AF19FF',
// };

// const MONTH_NAME = {
//   1: 'January',
//   2: 'February',
//   3: 'March',
//   4: 'April',
//   5: 'May',
//   6: 'June',
//   7: 'July',
//   8: 'August',
//   9: 'September',
//   10: 'October',
//   11: 'November',
//   12: 'December',
// }

// const App = () => {
//   const [data, setData] = useState([]);
//   const [months, setMonths] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState('');

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const pressedKey = event.key;
//       if (pressedKey >= '1' && pressedKey <= '9') {
//         const index = parseInt(pressedKey) - 1;
//         if (index < months.length) {
//           handleMonthClick(months[index]);
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [months]);

//   const handleFileLoad = (data) => {
//     const categories = {};
//     const monthSet = new Set();
//     data.forEach(row => {
//       const month = row[0];
//       const category = row[1];
//       const amount = parseFloat(row[2]);
      
//       monthSet.add(month);

//       if (!categories[month]) {
//         categories[month] = {};
//       }
//       if (!categories[month][category]) {
//         categories[month][category] = 0;
//       }
//       categories[month][category] += amount;
//     });

//     setMonths(Array.from(monthSet));
//     setData(categories);
//   };

//   const handleMonthClick = (month) => {
//     setSelectedMonth(month);
//   };

//   const chartData = selectedMonth && data[selectedMonth]
//     ? Object.keys(data[selectedMonth])
//         .map(key => ({
//           name: key,
//           value: data[selectedMonth][key],
//           color: CATEGORY_COLORS[key] || CATEGORY_COLORS['Other'],
//         }))
//         .sort((a, b) => b.value - a.value)  // Sort the data by value in descending order
//     : [];

//   const renderLabel = (entry) => entry.name;

//   return (
//     <div className="App">
//       <h1>Expense Tracker</h1>
//       <CSVReader onFileLoaded={handleFileLoad} />
//       <div className="months">
//         {months.map(month => (
//           <button key={month} onClick={() => handleMonthClick(month)}>
//             {month}
//           </button>
//         ))}
//       </div>
//       {selectedMonth && (
//         <div className="chart-container">
//           <h2>{MONTH_NAME[selectedMonth]}</h2>
//           <PieChart width={500} height={500} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
//             <Pie
//               data={chartData}
//               cx={250}
//               cy={250}
//               labelLine={false}
//               outerRadius={150}
//               fill="#8884d8"
//               dataKey="value"
//               label={renderLabel}
//             >
//               {chartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;




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