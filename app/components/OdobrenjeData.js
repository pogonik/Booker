import React, {Component, PropTypes} from 'react';

import {Button} from 'react-toolbox/lib/button';

import { Scrollbars } from 'react-custom-scrollbars';

import UslugeData from './UslugeData';
import {Router, Route, Link, hashHistory} from 'react-router';

import 'bootstrap/dist/js/bootstrap.js';
import _ from 'lodash';
import {base} from '../utils/helpers';
import moment from 'moment';
import numeral from 'numeral';

import styles from './FakturaData.css'

const {BrowserWindow, webContents} = require('electron').remote;

export default class OdobrenjeData extends Component {

   state = {
		klijent:{},
      racun:{},
      path: '',
      editPath: '',
		data: {
         usluge: []
      }
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {

      let path = this.props.route.type+'/'+this.props.params.id;
      let editPath = '/'+this.props.route.type+'/edit/'+this.props.params.id;

      base.fetch(path, {
			context: this,
			asArray: false
		}).then(data => {
         this.getRacun(data.brojRacuna);
         this.setState({ data, path, editPath });
      });
	}

	componentWillReceiveProps(nextProps) {

      let path = nextProps.route.type+'/'+nextProps.params.id;
      let editPath = '/'+nextProps.route.type+'/edit/'+nextProps.params.id;

		base.fetch(path, {
			context: this,
			asArray: false
		}).then(data => {
         this.getRacun(data.brojRacuna);
         this.setState({ data, path, editPath });
      });
	}

   getRacun(broj) {
      base.fetch('racuni', {
			context: this,
			asArray: true,
         queries: {
            orderByChild: 'punBroj',
            equalTo: broj,
            limitToFirst: 1
         }
		}).then(data => {
         this.setState({ racun: data[0] });
         this.getKlijent(data[0].pib);
      });
	}

   getKlijent(pib) {
      // console.log(pib);
      base.fetch('klijenti', {
			context: this,
			asArray: true,
         queries: {
            orderByChild: 'pib',
            equalTo: pib,
            limitToFirst: 1
         }
		}).then(data => {
         this.setState({ klijent: data[0] });
      });
	}

	formatNumber(cell,row) {
		return numeral(cell).format('0,0.00');
	}

   printPage = () => {
      let cont = webContents.getFocusedWebContents();
      let adr = cont.getURL();
      let adr2 = adr.split('#');
      adr2 = adr2[0].replace('app.html', 'print.html');
      let win = new BrowserWindow({width: 1024, height: 768});
      win.on('closed', () => {
         win = null;
      });
      win.loadURL(adr2+'#/print/'+this.state.path);
	}

	render() {
		let scrollAutoHeight = window.innerHeight - 120;

      let naslov = 'Knjižno odobrenje';

		return (

         <Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>
            <div id="faktura">

               <h1 className="naslov">{naslov+' broj '+this.state.data.punBroj}</h1>

               <span className={styles.printBtn}>
                  <Button icon='print' floating mini primary onClick={this.printPage} />
               </span>

   				<Link to={this.state.editPath} className={styles.editBtn}>
                  <Button icon='edit' floating mini primary />
   				</Link>

               <div className="row">
                  <div className="col-lg-5">
                     <p><label>Knjižno odobrenje br.:</label> {this.state.data.punBroj}</p>
                     <p><label>Datum izdavanja:</label> {this.state.data.datum}</p>
                     <p><label>Mesto izdavanja:</label> {this.state.data.mesto}</p>
                     <p><label>Datum prometa usluge:</label> {this.state.data.datum}</p>
                     <p><label>DPO:</label> {this.state.data.datum}</p>
                     <p><label>Valuta:</label> {this.state.data.datum}</p>
                     <p><label>Fakturisao:</label> {this.state.data.autor}</p>
                  </div>

                  <div className="col-lg-5">
                     <label>Korisnik usluge:</label>
                     <p>{this.state.klijent.naziv}</p>
                     <p>{this.state.klijent.adresa}</p>
                     <p>{this.state.klijent.pib}</p>
                  </div>
               </div>

               <div>
                  <UslugeData data={this.state.data} />
               </div>

            </div>
         </Scrollbars>
		);
	}
}
