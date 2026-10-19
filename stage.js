#!/usr/bin/env node
// Turns a checkout of cleanflow2 into the STAGING site:
//  - every Apps Script URL → the staging backend (STAGING_API_URL); fails if any other is left;
//  - "STAGING" banner + title, noindex.
// Fails (exit 1, file untouched) if anything is not exactly as expected.
//
//   STAGING_API_URL=https://script.google.com/macros/s/<id>/exec REF=<ref> SHA=<sha> node stage.js <index.html>
'use strict';
const fs = require('fs');
const file = process.argv[2];
const api = process.env.STAGING_API_URL || '';
const ref = (process.env.REF || '?').replace(/[^\w./-]/g, '');
const sha = (process.env.SHA || '').slice(0, 7).replace(/[^0-9a-f]/g, '');
const fail = msg => { console.error('STAGING FAILED: ' + msg); process.exit(1); };

const URL_RE = /https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/g;
if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(api)) fail('STAGING_API_URL missing or not an Apps Script /exec URL');

let html = fs.readFileSync(file, 'utf8');
const found = html.match(URL_RE) || [];
if (!found.length) fail('no Apps Script URL found in the page');
if (found.every(u => u === api)) fail('page already points to staging?');
html = html.replace(URL_RE, api);
const left = (html.match(URL_RE) || []).filter(u => u !== api);
if (left.length) fail('non-staging Apps Script URL left: ' + left.length);

const one = (from, to, label) => {
  if (html.split(from).length !== 2) fail(`expected exactly one ${label}`);
  html = html.replace(from, () => to);
};
one('<title>CleanFlow</title>', '<title>STAGING · CleanFlow</title><meta name="robots" content="noindex,nofollow"/>', '<title>');
one('<body>', '<body><div style="position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#D97706;color:#fff;'
  + 'text-align:center;font:800 11px/18px system-ui,sans-serif;letter-spacing:.06em;pointer-events:none">'
  + `STAGING — dati di prova, non è il sito delle supervisor · ${ref}${sha ? ' @ ' + sha : ''}</div>`, '<body>');

fs.writeFileSync(file, html);
console.log(`staging page ready: ${found.length} backend URL(s) → staging, ref ${ref}${sha ? ' @ ' + sha : ''}`);
