import React, {Component, PropTypes} from 'react';

import {Button} from 'react-toolbox/lib/button';

import { Scrollbars } from 'react-custom-scrollbars';

import Rebase from 're-base';
import {Router, Route, Link, hashHistory} from 'react-router';

import 'bootstrap/dist/js/bootstrap.js';
import _ from 'lodash';
import {base} from '../utils/helpers';
import moment from 'moment';
import numeral from 'numeral';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import styles from './KlijentData.css';
import table from '../styles/table.css';

export default class IzvestajData extends Component {

   state = {
		klijent:[],
      totals: [],
		fakture: [],
      odobrenja: [],
      tableData: []
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {
      base.fetch('ko', {
         context: this,
         asArray: true
      }).then(odobrenja => {
         this.setState({odobrenja}, this.getFakture(this.props.params.id));
      });
      //this.getFakture(this.props.params.id);
	}

	componentWillReceiveProps(nextProps) {
      base.fetch('ko', {
         context: this,
         asArray: true
      }).then(odobrenja => {
         this.setState({odobrenja}, this.getFakture(nextProps.params.id));
      });
		//this.getFakture(nextProps.params.id);
	}

	getFakture(pib) {
      base.fetch('racuni', {
			context: this,
			asArray: true,
			queries: {
				orderByChild: 'pib',
				equalTo: pib
			}
		}).then(fakture => {

         _.map(fakture, (val, key) => {

            let ko = _.find(this.state.odobrenja, res => { return res.brojRacuna === val.punBroj });

            if(ko) {
               _.assign(val, { ko: ko.total, neto: val.total-ko.total, koData: ko });
            } else {
               _.assign(val, { ko: 0, neto: val.total, koData: [] });
            }

         });

         console.log(fakture);

         let totals = this.sumTotals(fakture);
         let ukupno = {
            punBroj: '',
            datum: '',
            mesto: 'UKUPNO',
            subtotal: totals[0],
            porez: totals[1],
            total: totals[2],
            ko: totals[3],
            neto: totals[4]
         };

         this.setState({fakture, totals, tableData: fakture.concat(ukupno) });
      });

      base.fetch('klijenti', {
			context: this,
			asArray: true,
			queries: {
				orderByChild: 'pib',
				equalTo: pib,
            limitToFirst: 1
			}
		}).then(data => {
         this.setState({klijent: data[0]});
      });
	}


   sumTotals(fakture) {
      let totals = [0,0,0,0,0];
      _.map(fakture, (val, key) => {
         totals[0] += val.subtotal;
         totals[1] += val.porez;
         totals[2] += val.total;
         totals[3] += val.ko;
         totals[4] += val.neto;
      });
      return totals;
   }

	formatNumber(cell,row) {
      //return cell;
		return numeral(cell).format('0,0.00');
	}

   formatID(cell,row) {
		return <Link to={'/racuni/'+row.key}>{cell}</Link>
	}

	render() {

      let scrollAutoHeight = window.innerHeight - 120;

      return (
			<Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight} id="izvestaj">

				<h1 className="naslov">{this.state.klijent.naziv}</h1>

				<BootstrapTable data={this.state.tableData} pagination={false} search={false}
               striped={true} hover={true} bordered={false}>
					<TableHeaderColumn dataField="punBroj" isKey={true} dataAlign="center" dataFormat={this.formatID}>Broj fakture</TableHeaderColumn>
					<TableHeaderColumn dataField="datum1">Datum</TableHeaderColumn>
					<TableHeaderColumn dataField="mesto">Mesto</TableHeaderColumn>
					<TableHeaderColumn dataField="subtotal" dataFormat={this.formatNumber}>Subtotal</TableHeaderColumn>
					<TableHeaderColumn dataField="porez" dataFormat={this.formatNumber}>Porez</TableHeaderColumn>
					<TableHeaderColumn dataField="total" dataFormat={this.formatNumber}>Total</TableHeaderColumn>
               <TableHeaderColumn dataField="ko" dataFormat={this.formatNumber}>K.O.</TableHeaderColumn>
					<TableHeaderColumn dataField="neto" dataFormat={this.formatNumber}>Neto</TableHeaderColumn>
				</BootstrapTable>

			</Scrollbars>
		);
	}
}
