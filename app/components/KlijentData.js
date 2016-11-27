import React, {Component, PropTypes} from 'react';

import {Button} from 'react-toolbox/lib/button';

import { Scrollbars } from 'react-custom-scrollbars';

import {Router, Route, Link, hashHistory} from 'react-router';

import 'bootstrap/dist/js/bootstrap.js';
import _ from 'lodash';
import {base} from '../utils/helpers';
import moment from 'moment';
import numeral from 'numeral';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import styles from './KlijentData.css';
import table from '../styles/table.css';

export default class KlijentData extends Component {

   state = {
		klijent:[],
      naziv: '',
      adresa: '',
      pib: '',
      mb: '',
		racun: '',
		fakture: []
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {
		base.fetch('klijenti/'+this.props.params.id, {
			context: this,
			state: 'klijent',
			asArray: false
		}).then(data => {
			this.setState({
				naziv:data.naziv,
				adresa: data.adresa,
				pib: data.pib,
				mb: data.mb,
				racun: data.racun
			});
			this.getFakture(data.pib);
		});
	}

	componentWillReceiveProps(nextProps) {
		base.fetch('klijenti/'+nextProps.params.id, {
			context: this,
			asArray: false
		}).then(data => {
			this.setState({
				naziv:data.naziv,
				adresa: data.adresa,
				pib: data.pib,
				mb: data.mb,
				racun: data.racun
			});
			this.getFakture(data.pib);
		});
	}

	getFakture(pib) {
		base.bindToState('racuni', {
			context: this,
			state: 'fakture',
			asArray: true,
			queries: {
				orderByChild: 'pib',
				equalTo: pib
			}
		});
	}

	formatNumber(cell,row) {
		return numeral(cell).format('0,0.00');
	}

   formatID(cell,row) {
		return <Link to={'/racuni/'+row.key}>{cell}</Link>
	}

	render() {

      let scrollAutoHeight = window.innerHeight - 120;

      return (
			<Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>
				<h1 className="naslov">{this.state.naziv}</h1>

				<Link to={'/klijenti/edit/'+this.props.params.id} className={styles.editBtn}>
               <Button icon='edit' floating mini primary />
				</Link>

				<p><b>Adresa: </b>{this.state.adresa}</p>
            <p><b>PIB: </b>{this.state.pib}</p>
            <p><b>Matični broj: </b>{this.state.mb}</p>
            <p><b>Tekući račun: </b>{this.state.racun}</p>

				<h3>Računi</h3>

				<BootstrapTable data={this.state.fakture} pagination={true} search={true}
               striped={true} hover={true} bordered={false}>
					<TableHeaderColumn dataField="punBroj" isKey={true} dataAlign="center" dataSort={true} dataFormat={this.formatID}>Broj fakture</TableHeaderColumn>
					<TableHeaderColumn dataField="datum1" dataSort={true}>Datum</TableHeaderColumn>
					<TableHeaderColumn dataField="mesto" dataSort={true}>Mesto</TableHeaderColumn>
					<TableHeaderColumn dataField="subtotal" dataFormat={this.formatNumber}>Subtotal</TableHeaderColumn>
					<TableHeaderColumn dataField="porez" dataFormat={this.formatNumber}>Porez</TableHeaderColumn>
					<TableHeaderColumn dataField="total" dataFormat={this.formatNumber}>Total</TableHeaderColumn>
				</BootstrapTable>

			</Scrollbars>
		);
	}
}
