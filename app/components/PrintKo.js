import React, {Component, PropTypes} from 'react';

import {Button} from 'react-toolbox/lib/button';

import UslugeData from './UslugeData';
import {Router, Route, Link, hashHistory} from 'react-router';

import 'bootstrap/dist/js/bootstrap.js';
import _ from 'lodash';
import {base} from '../utils/helpers';
import moment from 'moment';
import numeral from 'numeral';

import styles from './Print.css';

const {BrowserWindow, webContents, shell} = require('electron').remote;
var app = require('electron').remote;
var dialog = app.dialog;
const ipc = require('electron').ipcRenderer;
const fs = require('fs');

let cont = webContents.getFocusedWebContents();
let filename = '';

export default class PrintKo extends Component {

   state = {
		klijent:{},
      path: '',
		faktura: [],
      config: {},
      racun: {}
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {
      let path = 'ko/'+this.props.params.id;

		base.fetch(path, {
			context: this,
			asArray: false
		}).then(faktura => {
         this.getKlijent(faktura.klijent);
         this.getRacun(faktura.brojRacuna);
         this.setState({ faktura, path });
      });

      base.bindToState('config', {
         context: this,
         asArray: false,
         state: 'config'
      });
	}

   getKlijent(naziv) {
      base.fetch('klijenti', {
			context: this,
			asArray: true,
         queries: {
            orderByChild: 'naziv',
            equalTo: naziv,
            limitToFirst: 1
         }
		}).then(data => {
         this.setState({ klijent: data[0] });
      });
	}

   getRacun(num) {
      base.fetch('racuni', {
         context: this,
         asArray: true,
         queries: {
            orderByChild: 'punBroj',
            equalTo: num,
            limitToFirst: 1
         }
      }).then(racun => {
         this.setState({ racun:racun[0] });
      });
   }

	formatNumber(num) {
		return numeral(num).format('0,0.00');
	}

   printPage = () => {
      let cont = webContents.getFocusedWebContents();
      cont.print({ silent:false });
	}

   getPDFPrintSettings() {
      var option = {
         landscape: false,
         marginsType: 0,
         printBackground: false,
         printSelectionOnly: false,
         pageSize: 'A4'
      };

      return option;
   }

   savePDF = () => {
      let title = 'odobrenje_'+this.state.faktura.punBroj.replace('/','-');
      dialog.showSaveDialog(function(filepath) {

         filename = filepath+'.pdf';

         var option = {
            landscape: false,
            marginsType: 0,
            printBackground: false,
            printSelectionOnly: false,
            pageSize: 'A4'
         };

         cont.printToPDF(option, function(err, data) {
            if (err) {
               dialog.showErrorBox('Error', err);
               return;
            }
            fs.writeFile(filename, data, function (error) {
              if (error) {
                throw error
              }
             shell.openExternal('file://' + filename);
            })
         });

      });

   }

	render() {
      let { naziv, adresa, pib, mb } = this.state.klijent;
      let { punBroj, datum, mesto, porez, subtotal, total, usluge } = this.state.faktura;
      let { config } = this.state;
      let subheader = config.naziv+', '+config.adresa+', mat. broj: '+config.mb+', pib: '+config.pib+', tek. račun: '+config.racun;

		return (
         <div id="print" className="odobrenje container">

            <div className="skriveno">
               <span className={styles.printBtn}>
                  <Button icon='print' floating mini primary onClick={this.printPage} />
               </span>
               <span className={styles.pdfBtn}>
                  <Button icon='picture_as_pdf' floating mini primary onClick={this.savePDF} />
               </span>
            </div>

            <header>
               <table style={{width:'100%'}}>
                  <tbody>
                     <tr>
                        <td style={{width:'60%'}}>
                           <img src={config.logoUrl} id="logo" />
                        </td>
                        <td>
                           <div className="naslov"><h1 style={{color:'#b4cad3'}}>Knjižno odobrenje</h1></div>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div>
                  <div className="col-lg-12 adresa">
                     {subheader}
                  </div>
               </div>
            </header>

            <div id="podaci">
               <table style={{width:'100%'}}>
                  <tbody>
                     <tr>
                        <td style={{width:'50%'}}>
                           {config.naziv}<br/>
                           {config.adresa}<br/>
                           +381631091994<br/>
                           PIB: {config.pib}<br/>
                           ledmreza@gmail.com
                        </td>
                        <td>
                           <label>Korisnik usluge:</label><br/>
                           {naziv}<br/>
                           {adresa}<br/>
                           PIB: {pib}
                        </td>
                     </tr>
                  </tbody>
               </table>

               <table style={{width:'100%', marginTop:'20px'}} className="racunData">
                  <tbody>
                     <tr>
                        <td style={{width:'50%'}}>
                           <label>Račun br.:</label> {punBroj}<br/>
                           <label>Datum izdavanja:</label> {datum}<br/>
                           <label>Mesto izdavanja:</label> {mesto}<br/>
                           <label>Datum prometa usluge:</label> {datum}<br/>
                           <label>DPO:</label> {datum}<br/>
                           <label>Valuta:</label> {datum}
                        </td>
                        <td>
                        </td>
                     </tr>
                  </tbody>
               </table>

            </div>

            <div id="usluge">
               <UslugeData data={this.state.faktura} />
            </div>

            <div id="napomena" className="napomena">
               <p>Ukupan iznos: {this.formatNumber(this.state.faktura.total)} odobravamo na ime provizije za ostvarenu uslugu</p>
               <p>Shodno članu 21. Zakona o PDV-u, na bazi odobrenja {this.state.faktura.punBroj} molimo Vas da nam overom istog,</p>
               <p>potvrdite da ste izvršili korekciju odbitka prethodnog PDV-a u iznosu od RSD {this.formatNumber(this.state.faktura.porez)}.</p>
            </div>

            <div id="potpisi" className="potpisi">
               <p className="text-center"><b>{this.state.faktura.mesto+', '+this.state.faktura.datum}</b></p>
               <div className="left">
                  <div className="potpis">(primio)</div>
               </div>
               <div className="right">
                  <div className="potpis">(fakturisao)</div>
               </div>
            </div>

         </div>
		);
	}
}
