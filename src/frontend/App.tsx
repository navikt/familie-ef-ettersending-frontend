import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import './app.less';
import Filopplasting from './komponenter/Filopplasting';
import Filvisning from './komponenter/Filvisning';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

const App = () => {
  return (
    <div className="bakgrunn">
      <div className="app-konteiner">
        <h1>Ettersending av dokumentasjon</h1>
        <Ekspanderbartpanel tittel="Klikk her for å åpne/lukke panelet">
          <Filopplasting />
        </Ekspanderbartpanel>
      </div>
    </div>
  );
};

export default App;
