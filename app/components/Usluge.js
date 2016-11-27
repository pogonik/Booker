import React, {Component, PropTypes} from 'react';

import _ from 'lodash';
import numeral from 'numeral';
import styles from '../styles/styles.scss';
import Input from 'react-toolbox/lib/input';
import { Button, IconButton } from 'react-toolbox/lib/button';

export default class Usluge extends Component {

	static propTypes = {
   };

   static defaultProps = {
   };

   state = {
		subtotal: 0,
		pdv: '',
		porez: 0,
		total: 0
   };

   constructor(props) {
      super(props);
   }

	componentWillReceiveProps(nextProps) {
		let subtotal = 0;
		let pdv = 0;
		let porez = 0;
		let total = 0;
		_.map(nextProps.data, e => {
			pdv = parseInt(e.pdv);
			subtotal = _.round(subtotal + e.cena, 2);
			porez = _.round(porez + e.porez, 2);
			total = _.round(total + e.ukupno, 2);
		});
		this.setState({ subtotal: subtotal, pdv: pdv, porez: porez, total:total });
	}

	componentWillMount() {
		let subtotal = 0;
		let pdv = 0;
		let porez = 0;
		let total = 0;
		_.map(this.props.data, e => {
			pdv = parseInt(e.pdv);
			subtotal = _.round(subtotal + e.cena, 2);
			porez = _.round(porez + e.porez, 2);
			total = _.round(total + e.ukupno, 2);
		});
		this.setState({ subtotal: subtotal, pdv: pdv, porez: porez, total:total });
	}

	buildRows() {
		return this.props.data.map((val, key) => {
			let rb = key+1;
			let pdv = Number(val.pdv / 100)
			let porez = _.round(Number(val.cena * pdv), 2);
			let cena = Number(val.cena);
			let ukupno = _.round(cena+porez, 2);
			return (
				<tr key={key}>
					<td>{key+1}</td>
					<td>
						<Input type='text'
							multiline value={val.opis}
							placeholder="Unesite opis usluge..."
							onChange={this.props.onChange.bind(this, key, 'opis')} />
					</td>
					<td>
						<div contentEditable
							onInput={this.props.onChange.bind(this, key, 'cena')}
							suppressContentEditableWarning>
								{val.cena}
						</div>
					</td>
					<td>
						<div contentEditable className={styles.pdv}
							onInput={this.props.onChange.bind(this, key, 'pdv')}
							suppressContentEditableWarning>
								{val.pdv}
						</div><span>%</span>
					</td>
					<td>{porez}</td>
					<td>{ukupno}</td>
					<td><IconButton icon='remove_circle_outline' onClick={() => this.props.removeRow(key)} /></td>
				</tr>
			);
		});
	}

	render() {
		return (
			<div>
				<table className={styles.uslugeTabela}>
					<thead>
						<tr>
							<th>Rb.</th>
							<th>Opis usluge</th>
							<th>Cena</th>
							<th>PDV stopa</th>
							<th>PDV</th>
							<th>Ukupno</th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						{this.buildRows()}
					</tbody>
				</table>

				<table className={styles.uslugeTabela+' '+styles.subtotalTabela}>
				   <tbody>
				      <tr>
				         <th>Subtotal</th>
				         <td style={{textAlign:'right'}}>{numeral(this.state.subtotal).format('0,0.00')}</td>
				      </tr>
				      <tr>
				         <th>PDV Stopa</th>
				         <td style={{textAlign:'right'}}>{this.state.pdv+'%'}</td>
				      </tr>
				      <tr>
				         <th>PDV</th>
				         <td style={{textAlign:'right'}}>{numeral(this.state.porez).format('0,0.00')}</td>
				      </tr>
				      <tr>
				         <th>Total</th>
				         <td style={{textAlign:'right'}}>{numeral(this.state.total).format('0,0.00')}</td>
				      </tr>
				   </tbody>
				</table>

			</div>
		);
	}
}
