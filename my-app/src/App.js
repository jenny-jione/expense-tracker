// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import BarChartPage from './PageBarChart';
import PieChartPage from './PagePieChart';
import RankingTable from './PageRank';

const App = () => {
  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        <p></p>
        <h1>Monthly Expense Tracker</h1>
        <nav style={{ marginBottom: '20px' }}>
          <NavLink to="/bar" exact style={buttonStyle} activeStyle={activeButtonStyle}>
            Bar Chart
          </NavLink>
          <NavLink to="/pie" style={buttonStyle} activeStyle={activeButtonStyle}>
            Pie Chart
          </NavLink>
          <NavLink to="/rank" style={buttonStyle} activeStyle={activeButtonStyle}>
            Rank
          </NavLink>
          
        </nav>

        <Routes>
          <Route path="/bar" element={<BarChartPage />} />
          <Route path="/pie" element={<PieChartPage />} />
          <Route path="/rank" element={<RankingTable />} />
        </Routes>
      </div>
    </Router>
  );
};

const buttonStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#94b1d0',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '5px',
  margin: '0 10px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#568fcb',
};

export default App;
