export const EOppsummeringstitler = {
  Innsending: 'Følgende dokumentasjon er klar til innsending',
  Kvittering: 'Følgende dokumentasjon er sendt inn',
};

export type EOppsummeringstitler =
  (typeof EOppsummeringstitler)[keyof typeof EOppsummeringstitler];
