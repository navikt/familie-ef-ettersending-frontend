import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import * as React from 'react';
import App from './App';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate replace to="/" />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
