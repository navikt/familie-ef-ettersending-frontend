import React from 'react';
import './app.less';
import { Dokumentasjonsbehov } from './komponenter/Dokumentasjonsbehov';

const App = () => {
  return (
    <div className="bakgrunn">
      <div className="app-container">
        <h1>Ettersending av dokumentasjon</h1>
        <Dokumentasjonsbehov />
      </div>
    </div>
  );
};

export default App;
