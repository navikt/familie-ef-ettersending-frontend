export interface ISøker {
  adresse: IAdresse;
  egenansatt: boolean;
  fnr: string;
  forkortetNavn: string;
  erStrengtFortrolig: boolean;
  siviltilstand: string;
  statsborgerskap: string;
}

interface IAdresse {
  adresse: string;
  postnummer: string;
  poststed: string;
}

interface IBarn {
  alder: string;
  fnr: string;
  fødselsdato: string;
  harAdressesperre: boolean;
  harSammeAdresse: boolean;
  medForelder: any; //må settes
  navn: string;
}

export interface IPersoninfo {
  søker: ISøker;
  barn: Array<IBarn>;
}
