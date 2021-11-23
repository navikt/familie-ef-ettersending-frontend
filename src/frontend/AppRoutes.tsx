import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import App from './App';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
