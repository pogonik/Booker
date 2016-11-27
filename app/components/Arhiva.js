import React, {Component, PropTypes} from 'react';
import {Router, Route, Link, hashHistory} from 'react-router';

import {Button} from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import { Scrollbars } from 'react-custom-scrollbars';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Top from './Top';

import _ from 'lodash';
import { base, localeSrpski, mesta } from '../utils/helpers';
import moment from 'moment';
import numeral from 'numeral';

import styles from '../styles/styles.scss';

export default class Arhiva extends Component {

   state = {
      pocetak: moment().subtract(2,'months').toDate(),
      kraj: moment().toDate(),
      unixStart: moment().subtract(2,'months').format('x'),
      unixEnd: moment().format('x'),
		fakture: null
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {

      base.fetch('racuni', {
			context: this,
			state: 'fakture',
			asArray: true,
         queries: {
            orderByValue: 'broj'
         }
		}).then(fakture => {
         this.setState({fakture});
      });
	}

   handleChange = (name, val) => {
      this.setState({...this.state, [name]: val});
   };

   handleDateStart = (name, val) => {
      this.setState({ pocetak: val, unixStart: moment(val).format('x') });
   };
   handleDateEnd = (name, val) => {
      this.setState({ kraj: val, unixEnd: moment(val).format('x') });
   };

	formatNumber(cell,row) {
		return numeral(cell).format('0,0.00');
	}

   formatID(cell,row) {
		return <Link to={'/racuni/'+row.key}>{cell}</Link>
	}

   filterFakture() {
      return _.filter(this.state.fakture, (val,key) => {
         let datum = Number(moment(val.datum1, 'DD.MM.YYYY').format('x'));
         let start = Number(this.state.unixStart);
         let end = Number(this.state.unixEnd);

         return datum >= start && datum <= end;
         // return _.inRange(datum, start, end);
      });
   }

	render() {
		let scrollAutoHeight = window.innerHeight - 70;
      let filter = this.filterFakture();
		return (

         <div id="cont_wrapper">

				<main id="container">
					<Top />
					<div id="wrapper" className="izvestaj">

                  <Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>

                     <div className="content">

                        <h1 className="naslov">Arhiva</h1>

                        <div className="row">
                           <div className="col-lg-6">
                              <DatePicker autoOk label='Od'
                                 locale={localeSrpski}
                                 onChange={this.handleDateStart.bind(this, 'pocetak')}
                                 value={this.state.pocetak}
                                 className={styles.datePickerFaktura}
                                 inputFormat={val => { return moment(val).format('DD.MM.YYYY')}} />
                           </div>
                           <div className="col-lg-6">
                              <DatePicker autoOk label='Do'
                                 locale={localeSrpski}
                                 onChange={this.handleDateEnd.bind(this, 'kraj')}
                                 value={this.state.kraj}
                                 className={styles.datePickerFaktura}
                                 inputFormat={val => { return moment(val).format('DD.MM.YYYY')}} />
                           </div>

                        </div>


                        <div className="row">
                           <div className="col-lg-12">

                              <BootstrapTable data={filter} pagination={true} search={true}
                                 striped={true} hover={true} bordered={false}>
                  					<TableHeaderColumn dataField="punBroj" isKey={true} dataAlign="center" dataSort={true} dataFormat={this.formatID} width="150">Broj fakture</TableHeaderColumn>
                  					<TableHeaderColumn dataField="datum1" dataSort={true} width="150">Datum</TableHeaderColumn>
                  					<TableHeaderColumn dataField="klijent" dataSort={true}>Klijent</TableHeaderColumn>
                  					<TableHeaderColumn dataField="subtotal" dataFormat={this.formatNumber} width="150">Subtotal</TableHeaderColumn>
                  					<TableHeaderColumn dataField="porez" dataFormat={this.formatNumber} width="150">Porez</TableHeaderColumn>
                  					<TableHeaderColumn dataField="total" dataFormat={this.formatNumber} width="150">Total</TableHeaderColumn>
                  				</BootstrapTable>

                           </div>
                        </div>

   						</div>

   					</Scrollbars>

					</div>
				</main>
			</div>
		);
	}
}
