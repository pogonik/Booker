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

export default class FakturaData extends Component {

   state = {
		klijent:{},
      path: '',
      editPath: '',
		faktura: []
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {

      let path = this.props.route.type+'/'+this.props.params.id;
      let editPath = '/'+this.props.route.type+'/edit/'+this.props.params.id;

      this.setState({ path, editPath });

      base.fetch(path, {
			context: this,
			asArray: false
		}).then(faktura => {
         this.getKlijent(faktura.pib);
         this.setState({ faktura, path, editPath });
      });
	}

	componentWillReceiveProps(nextProps) {

      let path = nextProps.route.type+'/'+nextProps.params.id;
      let editPath = '/'+nextProps.route.type+'/edit/'+nextProps.params.id;

		base.fetch(path, {
			context: this,
			asArray: false
		}).then(faktura => {
         this.getKlijent(faktura.pib);
         this.setState({ faktura, path, editPath });
      });
	}

   getKlijent(pib) {
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

   formatID(cell,row) {
		return <Link to={'/racuni/'+row.key}>{cell}</Link>
	}

   printPage = () => {
      let cont = webContents.getFocusedWebContents();
      let adr = cont.getURL();
      let adr2 = adr.split('#');
      adr2 = adr2[0].replace('app.html', 'print.html');
      // console.log(adr2+'#/print/'+this.state.path);
      let win = new BrowserWindow({width: 1024, height: 768});
      win.on('closed', () => {
         win = null;
      });
      win.loadURL(adr2+'#/print/'+this.state.path);
	}

	render() {
      let { naziv, adresa, pib, mb } = this.state.klijent;
      let { punBroj, datum1, datum2, datum3, datum4, mesto, porez, subtotal, total, usluge, autor } = this.state.faktura;

		let scrollAutoHeight = window.innerHeight - 120;

      let naslov = 'Račun';
      if(this.props.route.type === 'predracuni')
         naslov = 'Predračun';
      else if(this.props.route.type === 'ponude')
         naslov = 'Ponuda';

		return (

         <Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>
            <div id="faktura">

               <h1 className="naslov">{naslov+' broj '+this.state.faktura.punBroj}</h1>

               <span className={styles.printBtn}>
                  <Button icon='print' floating mini primary onClick={this.printPage} />
               </span>

   				<Link to={this.state.editPath} className={styles.editBtn}>
                  <Button icon='edit' floating mini primary />
   				</Link>

               <div className="row">
                  <div className="col-lg-5">
                     <p><label>Račun br.:</label> {punBroj}</p>
                     <p><label>Datum izdavanja:</label> {datum1}</p>
                     <p><label>Mesto izdavanja:</label> {mesto}</p>
                     <p><label>Datum prometa usluge:</label> {datum2}</p>
                     <p><label>DPO:</label> {datum3}</p>
                     <p><label>Rok plaćanja:</label> {datum4}</p>
                     <p><label>Fakturisao:</label> {autor}</p>
                  </div>

                  <div className="col-lg-5">
                     <label>Korisnik usluge:</label>
                     <p>{naziv}</p>
                     <p>{adresa}</p>
                     <p>{pib}</p>
                  </div>
               </div>

               <div>
                  <UslugeData data={this.state.faktura} />
               </div>

            </div>
         </Scrollbars>
		);
	}
}
