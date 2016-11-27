import Rebase from 're-base';
var fs = require('fs');
var path = require('path');

// var app = require('electron').remote;

const remote = require('electron').remote;
const app = remote.app;

// export const bazaPath = path.resolve(process.env.PWD, 'baza.json');
// export const bazaPath = path.join(__dirname, 'baza.json');
export const bazaPath = path.join(app.getAppPath(), 'baza.json');
// console.log(app.getAppPath());

let baza = {};

if(fs.existsSync(bazaPath)) {
   let fileCont = fs.readFileSync(bazaPath, 'utf-8');
   baza = JSON.parse(fileCont);
}

export const config = baza;

export const base = Rebase.createClass({
   apiKey: baza.apiKey,
   authDomain: baza.authDomain,
   databaseURL: baza.databaseURL,
   storageBucket: baza.storageBucket
});

export const localeSrpski = {
   months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
   monthsShort: 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
   weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
   weekdaysShort: 'ne_po._ut._sr._če._pe._su.'.split('_'),
   weekdaysLetter: 'ne_po_ut_sr_če_pe_su'.split('_')
}

export const mesta = {'Sombor':'Sombor','Subotica':'Subotica'};
