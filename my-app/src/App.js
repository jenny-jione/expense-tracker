// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarChartPage from './PageBarChart';
import PieChartPage from './PagePieChart';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Bar Chart</Link>
            </li>
            <li>
              <Link to="/pie">Pie Chart</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<BarChartPage />} />
          <Route path="/pie" element={<PieChartPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
