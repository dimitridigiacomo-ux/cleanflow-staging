# CleanFlow — STAGING

Sito di prova: https://dimitridigiacomo-ux.github.io/cleanflow-staging/

- Pubblica un branch (o commit) di [`cleanflow2`](https://github.com/dimitridigiacomo-ux/cleanflow2) con lo **stesso build della produzione**, ma collegato al **backend di staging** (copia "CleanFlow STAGING" del foglio). La produzione non viene mai toccata.
- Lancio: *Actions → Deploy STAGING → Run workflow*, campo `ref` = branch da provare. Da terminale:
  `gh workflow run deploy-staging.yml -R dimitridigiacomo-ux/cleanflow-staging -f ref=<branch>`
- Variabile del repo `STAGING_API_URL` = URL `/exec` del web app di staging.
- `stage.js` sostituisce ogni URL Apps Script con quello di staging e si ferma se ne resta un altro. Aggiunge anche la fascia "STAGING" e `noindex`.
- I dati di partenza (proprietà, team, template) si leggono dal foglio vero, solo in lettura. Le pubblicazioni vanno nel foglio di staging.
- Il backend di staging si aggiorna dal repo privato con `node tools/push-staging.js --deploy`.
