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

var path = require('path');

const {BrowserWindow, webContents, shell} = require('electron').remote;
var app = require('electron').remote;
var dialog = app.dialog;
const ipc = require('electron').ipcRenderer;
const fs = require('fs');

let cont = webContents.getFocusedWebContents();
let filename = '';

export default class Print extends Component {

   state = {
		klijent:{},
      path: '',
      editPath: '',
		faktura: [],
      config: {}
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {
      let path = this.props.params.type+'/'+this.props.params.id;
      let editPath = '/'+this.props.params.type+'/edit/'+this.props.params.id;

      this.setState({ path, editPath });

      base.fetch(path, {
			context: this,
			state: 'faktura',
			asArray: false
		}).then(faktura => {
         this.getKlijent(faktura.pib);
         this.setState({ faktura, path, editPath });
      });

      base.bindToState('config', {
         context: this,
         asArray: false,
         state: 'config'
      });
	}

   getKlijent(pib) {
      // console.log(pib);
      base.fetch('klijenti', {
			context: this,
			state: 'klijent',
			asArray: true,
         queries: {
            orderByChild: 'pib',
            equalTo: pib,
            limitToFirst: 1
         }
		}).then(data => {
         this.setState({ klijent: data[0] });
         // console.log(data[0]);
      });
	}

	formatNumber(cell,row) {
		return numeral(cell).format('0,0.00');
	}

   formatID(cell,row) {
		return <Link to={'/racuni/'+row.key}>{cell}</Link>
	}

   printPage = () => {
      let cont = webContents.getFocusedWebContents();
      cont.print({ silent:false });
	}

   getPDFPrintSettings() {
      var option = {
         landscape: false,
         marginsType: 0,
         printBackground: true,
         printSelectionOnly: false,
         pageSize: 'A4'
      };

      return option;
   }

   savePDF = () => {

      dialog.showSaveDialog(function(filepath) {

         filename = filepath+'.pdf';

         var option = {
            landscape: false,
            marginsType: 0,
            printBackground: true,
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
      let { punBroj, datum1, datum2, datum3, datum4, mesto, porez, subtotal, total, usluge } = this.state.faktura;
      let { config } = this.state;
      let subheader = config.naziv+', '+config.adresa+', mat. broj: '+config.mb+', pib: '+config.pib+', tek. račun: '+config.racun;

		return (
         <div id="print" className="container">

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
                        <td style={{width:'70%'}}>
                           <img src={config.logoUrl} id="logo" />
                        </td>
                        <td>
                           <div className="naslov"><h1 style={{color:'#b4cad3'}}>RAČUN</h1></div>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div className="col-lg-12 adresa">
                  {subheader}
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
                           <label>Datum izdavanja:</label> {datum1}<br/>
                           <label>Mesto izdavanja:</label> {mesto}<br/>
                           <label>Datum prometa usluge:</label> {datum2}<br/>
                           <label>DPO:</label> {datum3}<br/>
                           <label>Rok plaćanja:</label> {datum4}
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
               <p>Napomena o poreskom oslobođenju: nema</p>
               <p>Za neblagovremeno plaćanje primeniće se zakonske odredbe iz dužničko poverilačkih odnosa.</p>
               <p>U slučaju spora nadležan je Privredni Sud u Somboru.</p>
            </div>

            <div id="potpisi" className="potpisi">
               <p className="text-center"><b>{this.state.faktura.mesto+', '+this.state.faktura.datum1}</b></p>
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
