import React, { useEffect, useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { categoryColors } from './constants';
import useFetchData from './useFetchData';
import './styles.css';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

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
        // borderColor: '#fff',
        // borderWidth: 1,
      }],
    };
  };

  const months = [...new Set(data.map(item => item.month))];
  const chartData = useMemo(() => getPieChartData(selectedMonth), [data, selectedMonth]);
  const totalExpense = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0).toLocaleString('ko-KR');

  const options = {
    responsive: true,
    plugins: {
      // 범례
      legend: {
        // display: false,
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0)) * 100).toFixed(2);
            return `${label}: ${value.toLocaleString('ko-KR')}원 (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          family: 'GowunDodum-Regular', // 글씨체 설정
          size: 13, // 글씨 크기 설정
          // weight: 'bold', // 글씨 굵기 설정
        },
        formatter: (value, context) => {
          const percentage = ((value / context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0)) * 100).toFixed(2);
          if (context.dataIndex < 10 && percentage > 5) {
          // if (context.dataIndex < 10 && ) {
            // const percentage = ((value / context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0)) * 100).toFixed(2);
            return `${context.chart.data.labels[context.dataIndex]}:${value.toLocaleString('ko-KR')}원\n(${percentage}%)`;
          }
          return null;
        },
        anchor: 'end',
        align: 'start',
        offset: 10,
      }
    },
    elements: {
      arc: {
        // borderColor: 'rgba(0,0,0,0)', // 테두리 색상을 투명하게 설정
        borderWidth: 1

      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        Monthly Expense Pie Chart
      </h1>
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
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2 >Total Expense: {totalExpense}원</h2>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PieChartPage;
