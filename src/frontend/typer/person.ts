export interface ISøker {
  adresse: IAdresse;
  egenansatt: boolean;
  fnr: string;
  forkortetNavn: string;
  harAdressesperre: boolean;
  siviltilstand: string;
  statsborgerskap: string;
}

interface IAdresse {
  adresse: string;
  postnummer: string;
  poststed: string;
}
