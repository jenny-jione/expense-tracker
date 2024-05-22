import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './App.css';

const CATEGORY_COLORS = {
  식비: '#5FB43D',
  외식: '#F8D89E',
  통신비: '#76ADD2',
  교통: '#598FB0',
  생필품: '#A7C6D0',
  생활용품: '#79B0C1',
  미용: '#F1B6D5',
  의류잡화: '#F8D9DE',
  자기계발: '#D6D6D6',
  웹결제: '#B596C4',
  문화생활: '#D6BCA2',
  문구: '#C0E59D',
  건강관리: '#D6D6D6',
  의료: '#B4EEEB',
  친목: '#F1A3C7',
  선물: '#D6D6D6',
  가족: '#FFABB9',
  경조사: '#8D7668',
  여행: '#42906D',
  기타: '#D6D6D6',
  Other: '#AF19FF',
};

const App = () => {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleFileLoad = (data) => {
    const categories = {};
    const monthSet = new Set();
    data.forEach(row => {
      const month = row[0];
      const category = row[1];
      const amount = parseFloat(row[2]);
      
      monthSet.add(month);

      if (!categories[month]) {
        categories[month] = {};
      }
      if (!categories[month][category]) {
        categories[month][category] = 0;
      }
      categories[month][category] += amount;
    });

    setMonths(Array.from(monthSet));
    setData(categories);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  const chartData = selectedMonth && data[selectedMonth]
    ? Object.keys(data[selectedMonth])
        .map(key => ({
          name: key,
          value: data[selectedMonth][key],
          color: CATEGORY_COLORS[key] || CATEGORY_COLORS['Other'],
        }))
        .sort((a, b) => b.value - a.value)  // Sort the data by value in descending order
    : [];

  const renderLabel = (entry) => entry.name;

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <CSVReader onFileLoaded={handleFileLoad} />
      <div className="months">
        {months.map(month => (
          <button key={month} onClick={() => handleMonthClick(month)}>
            {month}
          </button>
        ))}
      </div>
      {selectedMonth && (
        <div className="chart-container">
          <h2>Expenses for {selectedMonth}</h2>
          <PieChart width={500} height={500} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={chartData}
              cx={250}
              cy={250}
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={renderLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default App;