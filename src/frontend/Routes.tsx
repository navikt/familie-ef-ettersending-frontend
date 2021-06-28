import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import * as React from 'react';
import App from './App';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={App} />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;
