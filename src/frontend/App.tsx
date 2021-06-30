import React from 'react';
import './app.less';
import { Dokumentasjonsbehov } from './komponenter/Dokumentasjonsbehov';

const App = () => {
  // const [navn, settNavn] = useState('');

  // const hentData = () => {
  //   return axios
  //     .get('http://localhost:8091/api/oppslag/sokerinfo', {
  //       withCredentials: true,
  //     })
  //     .then((response: { data: any }) => {
  //       console.log(response.data);
  //     });
  // };

  // const hentPerson = () => {
  //   return axios
  //     .get('http://localhost:8091/api/oppslag/sokerinfo', {
  //       withCredentials: true,
  //     })
  //     .then((response: { data: any }) => {
  //       console.log(response.data.søker.forkortetNavn);
  //       settNavn(response.data.søker.forkortetNavn);
  //     });
  // };

  // hentData();
  // hentPerson();

  return (
    <div className="bakgrunn">
      <div className="app-konteiner">
        <h1>Ettersending av dokumentasjon</h1>
        <Dokumentasjonsbehov />
      </div>
    </div>
  );
};

export default App;
