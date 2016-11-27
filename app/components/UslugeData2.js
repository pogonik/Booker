import React, {Component, PropTypes} from 'react';

import _ from 'lodash';
import numeral from 'numeral';
import styles from '../styles/styles.scss';

export default class UslugeData2 extends Component {

	buildRows() {
		return _.map(this.props.data.usluge, (val, key) => {
			let cena = numeral(val.cena).format('0,0.00');
			let pdv = val.pdv+"%";
			let porez = numeral(val.porez).format('0,0.00');
			let ukupno = numeral(val.ukupno).format('0,0.00');
			return (
				<tr key={key}>
					<td>{val.rb}</td>
					<td>{val.opis}</td>
					<td>{cena}</td>
					<td style={{textAlign: 'center'}}>{pdv}</td>
					<td>{porez}</td>
					<td>{ukupno}</td>
				</tr>
			);
		});
	}

	render() {
		return (
			<div className="row">
				<div className="col-lg-12">
					<table className="table table-striped" style={{margin:0}}>
						<thead>
							<tr>
								<th>Rb.</th>
								<th>Opis usluge</th>
								<th>Cena</th>
								<th style={{minWidth:'100px'}}>PDV stopa</th>
								<th style={{minWidth:'100px'}}>PDV</th>
								<th style={{minWidth:'100px'}}>Ukupno</th>
							</tr>
						</thead>

						<tbody>
							{this.buildRows()}
							<tr><td colSpan="6"><div style={{height:'20px'}}></div></td></tr>
							<tr>
								<td colSpan="4"></td>
								<th>Subtotal</th>
								<td>{numeral(this.props.data.subtotal).format('0,0.00')}</td>
							</tr>
							<tr>
								<td colSpan="4"></td>
								<th>PDV Stopa</th>
								<td>{this.props.data.pdv+'%'}</td>
							</tr>
							<tr>
								<td colSpan="4"></td>
								<th>PDV</th>
								<td>{numeral(this.props.data.porez).format('0,0.00')}</td>
							</tr>
							<tr>
								<td colSpan="4"></td>
								<th>Total</th>
								<td>{numeral(this.props.data.total).format('0,0.00')}</td>
							</tr>
						</tbody>

					</table>
				</div>
			</div>
		);
	}
}
