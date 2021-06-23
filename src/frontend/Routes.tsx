import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import * as React from 'react';
import App from './App';
import Foo from './komponenter/Foo';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/hjem" component={App} />
        <Route path="/foo" component={Foo} />
        <Redirect from="/" to="/hjem" />
      </Switch>
    </Router>
  );
};

export default Routes;
