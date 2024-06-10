import React, { useEffect, useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { categoryColors } from './constants';
import useFetchData from './useFetchData';
import './styles.css';

Chart.register(...registerables);

const PieChartPage = () => {
  const { data, error } = useFetchData('/data.csv');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [displayedMonth, setDisplayedMonth] = useState('');

  useEffect(() => {
    if (data.length > 0) {
      setSelectedMonth(data[0].month); // 첫 번째 월을 기본값으로 설정
      setDisplayedMonth(data[0].month); // 첫 번째 월을 화면에 표시
    }
  }, [data]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setDisplayedMonth(month); // 선택된 월을 화면에 표시
  };

  const getPieChartData = (month) => {
    const filteredData = data.filter(item => item.month === month);
    const categories = [...new Set(filteredData.map(item => item.category))];

    const categoryAmounts = categories.map(category => {
      const totalAmount = filteredData
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.amount, 0);
      return { category, totalAmount };
    });

    // 금액 기준으로 정렬
    categoryAmounts.sort((a, b) => b.totalAmount - a.totalAmount);

    return {
      labels: categoryAmounts.map(item => item.category),
      datasets: [{
        data: categoryAmounts.map(item => item.totalAmount),
        backgroundColor: categoryAmounts.map(item => categoryColors[item.category]),
      }],
    };
  };

  const months = [...new Set(data.map(item => item.month))];
  const chartData = useMemo(() => getPieChartData(selectedMonth), [data, selectedMonth]);
  const options = {
    elements: {
      arc: {
        borderColor: 'rgba(0,0,0,0)', // 테두리 색상을 투명하게 설정
      },
    },
  };



  return (
    <div>
      <h1>Monthly Expense Pie Chart </h1>
      {/* <div className='current-month'>{selectedMonth}월</div> */}
      {error && <div className="error-message">{error}</div>}
      {data.length > 0 ? (
        <div>
          <div className="button-group">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthChange(month)}
                className={month === displayedMonth ? 'selected' : ''}
              >
                {month}월
              </button>
            ))}
          </div>
          <div className="chart-container">
            <Pie data={chartData} options={options}/>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PieChartPage;