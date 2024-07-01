import React from 'react';
import useFetchData from './useFetchData';
import { categoryColors } from './constants';
import './styles.css';

const RankingTable = () => {
  const { data, error } = useFetchData('/data.csv');

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const processMonthlyRankings = (data) => {
    const monthlyData = {};

    data.forEach(({ month, category, amount }) => {
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push({ category, amount });
    });

    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].sort((a, b) => b.amount - a.amount);
    });

    return monthlyData;
  };

  const monthlyRankings = processMonthlyRankings(data);

  const renderTable = () => {
    const months = Object.keys(monthlyRankings).sort((a, b) => parseInt(a) - parseInt(b));
    const maxRank = Math.max(...months.map(month => monthlyRankings[month].length));

    return (
      <table border="0">
        <thead>
          <tr>
            <th></th>
            {months.map(month => (
              <th key={month}>{month}월</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRank }).map((_, rank) => (
            <tr key={rank}>
              <td>{rank + 1}위</td>
              {months.map(month => {
                const entry = monthlyRankings[month][rank];
                const category = entry ? entry.category : null;
                const amount = entry ? entry.amount : null;
                // const backgroundColor = category ? categoryColors[category] : '#ffffff';
                const backgroundColor = '#ffffff';
                return (
                  <td key={month} style={{ backgroundColor }}>
                    {/* {category ? `${category} (${amount})` : '-'} */}
                    {category ? `${category} (${amount})` : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
        {/* <h3>각 월의 카테고리 순위</h3> */}
        <div className='table-container'>
        {renderTable()}
        </div>
    </div>
  );
};

export default RankingTable;
