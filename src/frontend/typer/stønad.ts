export enum StønadType {
  OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
  BARNETILSYN = 'BARNETILSYN',
  SKOLEPENGER = 'SKOLEPENGER',
}

export const stønadTypeTilTekst: Record<StønadType, string> = {
  OVERGANGSSTØNAD: 'Overgangsstønad',
  BARNETILSYN: 'Barnetilsyn',
  SKOLEPENGER: 'Skolepenger',
};

export const stønadsTyper: StønadType[] = [
  StønadType.OVERGANGSSTØNAD,
  StønadType.BARNETILSYN,
  StønadType.SKOLEPENGER,
];

export const dokumenttyperForStønad = (
  stønadType?: StønadType
): DokumentType[] => {
  const sorterDokumenttyperPåNavn = (a: DokumentType, b: DokumentType) =>
    dokumentTypeTilTekst[a] > dokumentTypeTilTekst[b] ? 1 : -1;

  switch (stønadType) {
    case StønadType.OVERGANGSSTØNAD:
      return dokumentTyperOvergangsstønad.sort(sorterDokumenttyperPåNavn);
    case StønadType.BARNETILSYN:
      return dokumentTyperBarnetilsyn.sort(sorterDokumenttyperPåNavn);
    case StønadType.SKOLEPENGER:
      return dokumentTyperSkolepenger.sort(sorterDokumenttyperPåNavn);
    default:
      return (Object.keys(DokumentType) as Array<DokumentType>).sort(
        sorterDokumenttyperPåNavn
      );
  }
};

export const dokumentTypeTilTekst: Record<DokumentType, string> = {
  DOKUMENTASJON_IKKE_VILLIG_TIL_ARBEID:
    'Dokumentasjon som beskriver grunnen til at du ikke kan ta ethvert arbeid',
  DOKUMENTAJSON_SYK:
    'Dokumentasjon som viser at du er for syk til å være i arbeid',
  DOKUMENTAJSON_OM_VIRKSOMHETEN_DU_ETABLERER:
    'Næringsfaglig vurdering av virksomheten du etablerer',
  DOKUMNENTASJON_UTDANNING: 'Dokumentasjon på utdanningen du tar eller skal ta',
  DOKUMENTASJON_UTFGIFTER_UTDANNING: 'Utgifter til skolepenger',
  DOKUMENTASJON_ARBEIDSKONTRAKT:
    'Arbeidskontrakt som viser at du har fått tilbud om arbeid.',
  DOKUMENTASJON_LÆRLING: 'Lærlingkontrakt',
  TERMINBEKREFTELSE: 'Terminbekreftelse',
  FAKTURA_FRA_BARNEPASSORDNING:
    'Faktura fra barnepassordningen for perioden du søker om nå',
  AVTALE_MED_BARNEPASSER: 'Avtalen du har med barnepasseren',
  DOKUMENTASJON_TRENGER_MER_PASS_ENN_JEVNALDREDE:
    'Dokumentasjon som viser at barnet ditt har behov for vesentlig mer pass enn det som er vanlig for jevnaldrende',
  DOKUMENTASJON_UTENOM_VANLIG_ARBEIDSTID:
    'Dokumentasjon som viser at du jobber turnus eller skift, og jobber på tider utenom vanlig arbeidstid',
  DOKUMENTASJON_MYE_BORTE_PGA_JOBB:
    'Dokumentasjon som viser at du må være borte fra hjemmet i lengre perioder på grunn av jobb',
  DOKUMENTASJON_BOR_PÅ_ULIKE_ADDRESSER:
    'Dokumentasjon som viser at du og tidligere samboer bor på ulike adresser',
  DOKUMENTAJSON_BARN_BOR_HOS_DEG: 'Dokumentasjon som viser at barn bor hos deg',
  AVTALE_OM_DELT_BOSTED: 'Avtale om delt fast bosted',
  SAMVÆRSAVTALE_MED_KONKRETE_TIDSPUNKTER:
    'Samværsavtale med konktrete tidspunkter',
  SAMVÆRSAVTALE_UTEN_KONKRETE_TIDSPUNKTER:
    'Samværsavtale uten konkrete tidspunkter',
  DOKUMENTASJON_SYKDOM: 'Dokumentasjon som viser at du er syk',
  DOKUMENTASJON_SYKT_BARN: 'Dokumentasjon på barnets sykdom',
  DOKUMENTASJON_BARNEPASS_MANGEL:
    'Dokumentasjon som viser at du mangler barnepass ',
  DOKUMENTASJON_BARNETILSYN_BEHOV: 'Dokumentasjon på barnets tilsynsbehov',
  ARBEIDSFORHOLD_OG_OPPSIGELSESÅRSAK:
    'Dokumentasjon på arbeidsforholdet og årsaken til at du sluttet',
  ARBEIDSFORHOLD_OG_REDUSERT_ARBEIDSTID:
    'Dokumentasjon på arbeidsforholdet og årsaken til at du reduserte arbeidstiden',
  ERKLÆRING_SAMLIVSBRUDD:
    'Bekreftelse på samlivsbrudd med den andre forelderen',
  DOKUMENTASJON_INNGÅTT_EKTESKAP: 'Dokumentasjon på inngått ekteskap',
  DOKUMENTASJON_UFORMELT_SEPARERT_ELLER_SKILT:
    'Dokumentasjon på separasjon eller skilsmisse',
  BEKREFTELSE_SEPRASJON_SØKNAD:
    'Dokumentasjon på søkt separasjon eller skilsmisse',
  ANNET: 'Annet',
};
export enum DokumentType {
  DOKUMENTASJON_IKKE_VILLIG_TIL_ARBEID = 'DOKUMENTASJON_IKKE_VILLIG_TIL_ARBEID',
  DOKUMENTAJSON_SYK = 'DOKUMENTAJSON_SYK',
  DOKUMENTAJSON_OM_VIRKSOMHETEN_DU_ETABLERER = 'DOKUMENTAJSON_OM_VIRKSOMHETEN_DU_ETABLERER',
  DOKUMNENTASJON_UTDANNING = 'DOKUMNENTASJON_UTDANNING',
  DOKUMENTASJON_UTFGIFTER_UTDANNING = 'DOKUMENTASJON_UTFGIFTER_UTDANNING',
  DOKUMENTASJON_ARBEIDSKONTRAKT = 'DOKUMENTASJON_ARBEIDSKONTRAKT',
  DOKUMENTASJON_LÆRLING = 'DOKUMENTASJON_LÆRLING',
  TERMINBEKREFTELSE = 'TERMINBEKREFTELSE',
  FAKTURA_FRA_BARNEPASSORDNING = 'FAKTURA_FRA_BARNEPASSORDNING',
  AVTALE_MED_BARNEPASSER = 'AVTALE_MED_BARNEPASSER',
  DOKUMENTASJON_TRENGER_MER_PASS_ENN_JEVNALDREDE = 'DOKUMENTASJON_TRENGER_MER_PASS_ENN_JEVNALDREDE',
  DOKUMENTASJON_UTENOM_VANLIG_ARBEIDSTID = 'DOKUMENTASJON_UTENOM_VANLIG_ARBEIDSTID',
  DOKUMENTASJON_MYE_BORTE_PGA_JOBB = 'DOKUMENTASJON_MYE_BORTE_PGA_JOBB',
  DOKUMENTASJON_BOR_PÅ_ULIKE_ADDRESSER = 'DOKUMENTASJON_BOR_PÅ_ULIKE_ADDRESSER',
  DOKUMENTAJSON_BARN_BOR_HOS_DEG = 'DOKUMENTAJSON_BARN_BOR_HOS_DEG',
  AVTALE_OM_DELT_BOSTED = 'AVTALE_OM_DELT_BOSTED',
  SAMVÆRSAVTALE_MED_KONKRETE_TIDSPUNKTER = 'SAMVÆRSAVTALE_MED_KONKRETE_TIDSPUNKTER',
  SAMVÆRSAVTALE_UTEN_KONKRETE_TIDSPUNKTER = 'SAMVÆRSAVTALE_UTEN_KONKRETE_TIDSPUNKTER',
  DOKUMENTASJON_SYKDOM = 'DOKUMENTASJON_SYKDOM',
  DOKUMENTASJON_SYKT_BARN = 'DOKUMENTASJON_SYKT_BARN',
  DOKUMENTASJON_BARNEPASS_MANGEL = 'DOKUMENTASJON_BARNEPASS_MANGEL',
  DOKUMENTASJON_BARNETILSYN_BEHOV = 'DOKUMENTASJON_BARNETILSYN_BEHOV',
  ARBEIDSFORHOLD_OG_OPPSIGELSESÅRSAK = 'ARBEIDSFORHOLD_OG_OPPSIGELSESÅRSAK',
  ARBEIDSFORHOLD_OG_REDUSERT_ARBEIDSTID = 'ARBEIDSFORHOLD_OG_REDUSERT_ARBEIDSTID',
  ERKLÆRING_SAMLIVSBRUDD = 'ERKLÆRING_SAMLIVSBRUDD',
  DOKUMENTASJON_INNGÅTT_EKTESKAP = 'DOKUMENTASJON_INNGÅTT_EKTESKAP',
  DOKUMENTASJON_UFORMELT_SEPARERT_ELLER_SKILT = 'DOKUMENTASJON_UFORMELT_SEPARERT_ELLER_SKILT',
  BEKREFTELSE_SEPRASJON_SØKNAD = 'BEKREFTELSE_SEPRASJON_SØKNAD',
  ANNET = 'ANNET',
}

export const dokumentTyperOvergangsstønad: DokumentType[] = [
  DokumentType.DOKUMENTASJON_IKKE_VILLIG_TIL_ARBEID,
  DokumentType.DOKUMENTAJSON_SYK,
  DokumentType.DOKUMENTAJSON_OM_VIRKSOMHETEN_DU_ETABLERER,
  DokumentType.DOKUMENTASJON_ARBEIDSKONTRAKT,
  DokumentType.DOKUMENTASJON_LÆRLING,
  DokumentType.TERMINBEKREFTELSE,
  DokumentType.DOKUMENTASJON_BOR_PÅ_ULIKE_ADDRESSER,
  DokumentType.DOKUMENTAJSON_BARN_BOR_HOS_DEG,
  DokumentType.AVTALE_OM_DELT_BOSTED,
  DokumentType.SAMVÆRSAVTALE_MED_KONKRETE_TIDSPUNKTER,
  DokumentType.SAMVÆRSAVTALE_UTEN_KONKRETE_TIDSPUNKTER,
  DokumentType.DOKUMENTASJON_SYKDOM,
  DokumentType.DOKUMENTASJON_SYKT_BARN,
  DokumentType.DOKUMENTASJON_BARNEPASS_MANGEL,
  DokumentType.ARBEIDSFORHOLD_OG_OPPSIGELSESÅRSAK,
  DokumentType.ARBEIDSFORHOLD_OG_REDUSERT_ARBEIDSTID,
  DokumentType.ERKLÆRING_SAMLIVSBRUDD,
  DokumentType.DOKUMENTASJON_INNGÅTT_EKTESKAP,
  DokumentType.DOKUMENTASJON_UFORMELT_SEPARERT_ELLER_SKILT,
  DokumentType.BEKREFTELSE_SEPRASJON_SØKNAD,
  DokumentType.DOKUMNENTASJON_UTDANNING,
  DokumentType.ANNET,
];

export const dokumentTyperSkolepenger: DokumentType[] = [
  DokumentType.DOKUMENTAJSON_SYK,
  DokumentType.DOKUMENTASJON_UTFGIFTER_UTDANNING,
  DokumentType.TERMINBEKREFTELSE,
  DokumentType.DOKUMENTASJON_BOR_PÅ_ULIKE_ADDRESSER,
  DokumentType.DOKUMENTAJSON_BARN_BOR_HOS_DEG,
  DokumentType.AVTALE_OM_DELT_BOSTED,
  DokumentType.SAMVÆRSAVTALE_MED_KONKRETE_TIDSPUNKTER,
  DokumentType.SAMVÆRSAVTALE_UTEN_KONKRETE_TIDSPUNKTER,
  DokumentType.DOKUMENTASJON_SYKDOM,
  DokumentType.DOKUMENTASJON_SYKT_BARN,
  DokumentType.ERKLÆRING_SAMLIVSBRUDD,
  DokumentType.DOKUMENTASJON_INNGÅTT_EKTESKAP,
  DokumentType.DOKUMENTASJON_UFORMELT_SEPARERT_ELLER_SKILT,
  DokumentType.BEKREFTELSE_SEPRASJON_SØKNAD,
  DokumentType.ANNET,
];

export const dokumentTyperBarnetilsyn: DokumentType[] = [
  DokumentType.DOKUMENTASJON_IKKE_VILLIG_TIL_ARBEID,
  DokumentType.DOKUMENTAJSON_SYK,
  DokumentType.DOKUMENTAJSON_OM_VIRKSOMHETEN_DU_ETABLERER,
  DokumentType.DOKUMENTASJON_ARBEIDSKONTRAKT,
  DokumentType.DOKUMENTASJON_LÆRLING,
  DokumentType.TERMINBEKREFTELSE,
  DokumentType.FAKTURA_FRA_BARNEPASSORDNING,
  DokumentType.AVTALE_MED_BARNEPASSER,
  DokumentType.DOKUMENTASJON_TRENGER_MER_PASS_ENN_JEVNALDREDE,
  DokumentType.DOKUMENTASJON_UTENOM_VANLIG_ARBEIDSTID,
  DokumentType.DOKUMENTASJON_MYE_BORTE_PGA_JOBB,
  DokumentType.DOKUMENTASJON_BOR_PÅ_ULIKE_ADDRESSER,
  DokumentType.DOKUMENTAJSON_BARN_BOR_HOS_DEG,
  DokumentType.AVTALE_OM_DELT_BOSTED,
  DokumentType.SAMVÆRSAVTALE_MED_KONKRETE_TIDSPUNKTER,
  DokumentType.SAMVÆRSAVTALE_UTEN_KONKRETE_TIDSPUNKTER,
  DokumentType.DOKUMENTASJON_SYKDOM,
  DokumentType.DOKUMENTASJON_SYKT_BARN,
  DokumentType.DOKUMENTASJON_BARNEPASS_MANGEL,
  DokumentType.DOKUMENTASJON_BARNETILSYN_BEHOV,
  DokumentType.ARBEIDSFORHOLD_OG_OPPSIGELSESÅRSAK,
  DokumentType.ARBEIDSFORHOLD_OG_REDUSERT_ARBEIDSTID,
  DokumentType.ERKLÆRING_SAMLIVSBRUDD,
  DokumentType.DOKUMENTASJON_INNGÅTT_EKTESKAP,
  DokumentType.DOKUMENTASJON_UFORMELT_SEPARERT_ELLER_SKILT,
  DokumentType.BEKREFTELSE_SEPRASJON_SØKNAD,
  DokumentType.DOKUMNENTASJON_UTDANNING,
  DokumentType.ANNET,
];
