# familie-ef-ettersending

Frontend app for ettersending av dokumentasjons vedrørende søknader tilknyttet stønader for enslige forsørgere.

## Kjør lokalt

1. `yarn install`
2. Kjør opp `familie-ef-soknad-api` med launcheren `ApplicationLocalLauncher`
3. Kjør opp `familie-dokument` med launcheren `DevLauncherForSøknad`
4. `yarn start:dev`

For å få en gyldig cookie med `familie-ef-soknad-api` må du besøke en av følgende adresser:

- http://localhost:8091/local/cookie?subject=[gyldigFødselsnummer]
- http://localhost:8091/local/cookie?issuerId=selvbetjening&audience=aud-localhost

## Henvendelser
Spørsmål knyttet til koden eller prosjektet kan rettes mot:

* Viktor Grøndalen Solberg, `viktor.grondalen.solberg@nav.no`
