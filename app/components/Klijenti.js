import React, {Component, PropTypes} from 'react';

import Input from 'react-toolbox/lib/input';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import {Button} from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Dialog from 'react-toolbox/lib/dialog';

import { Scrollbars } from 'react-custom-scrollbars';
import Fuse from 'fuse.js';

import {Router, Route, Link, hashHistory} from 'react-router';

import KlijentNovoForm from '../forms/KlijentNovoForm';
import Top from '../components/Top';

import _ from 'lodash';
import {base} from '../utils/helpers';
import moment from 'moment';

import styles from '../styles/styles.scss';

const searchOptions = {
	shouldSort: true,
	threshold: 0.2,
	distance: 200,
	maxPatternLength: 32,
	keys: ["naziv","adresa","pib"]
};

export default class Klijenti extends Component {

	static propTypes = {
		klijent: PropTypes.number
   };

   static defaultProps = {
		klijent: null
   };

   state = {
		klijent: null,
      klijenti: [],
      naziv: '',
      adresa: '',
      pib: '',
      mb: '',
		searchTerm: '',
		dialog: false,
		itemToDelete: null,
		klijentToDelete: ''
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {
		base.bindToState('klijenti', {
			context: this,
			state: 'klijenti',
			asArray: true
		});
	}

	updateSearch = (name, val) => {
		this.setState({...this.state, [name]: val});
	}

	handleDialog = () => {
		this.setState({ dialog: !this.state.dialog });
	}

	removeWarning = (val) => {
		let klijentToDelete = this.state.klijenti[val];
		this.setState({ klijentToDelete: klijentToDelete.naziv, itemToDelete: klijentToDelete.key, dialog: true });
	}

	removeConfirm = () => {
		let { itemToDelete } = this.state;
		base.database().ref('klijenti/'+itemToDelete).remove();
		this.setState({ dialog: false });
	}

	actions = [
      { label: "Odustani", onClick: this.handleDialog },
      { label: "Obriši", onClick: this.removeConfirm}
   ];

	gotoEdit = (key) => {
		hashHistory.push('/klijenti/edit/'+key);
	}

	listClients() {
		let result = this.state.klijenti;
		if(this.state.searchTerm !== '') {
			const fuse = new Fuse(this.state.klijenti, searchOptions);
			result = fuse.search(this.state.searchTerm);
		}

		return result.map((val, key) => {

			let caption = _.truncate(val.naziv, { 'length':35 });

			let legend = _.truncate(val.adresa, { 'length':35 });

			let rightMenu = [
				<IconMenu key={key} icon='more_vert' position='topRight' menuRipple>
					<MenuItem icon='edit' caption='Izmeni' onClick={this.gotoEdit.bind(this,val.key)} />
					<MenuDivider />
					<MenuItem icon='delete' caption='Obriši' onClick={this.removeWarning.bind(this,key)} />
				</IconMenu>
			];

		   return (
		      <Link key={key} to={'/klijenti/'+val.key} activeClassName="active">
		         <ListItem caption={caption} legend={legend} rightActions={rightMenu} />
		      </Link>
		   );
		});
	}

	render() {
		let scrollAutoHeight = window.innerHeight - 70;

		return (
			<div id="cont_wrapper">
				<div id="list">
					<div className="top">
						<Input floating={false}
							placeholder="Search"
							onChange={this.updateSearch.bind(this,'searchTerm')}
							className={styles.top_search} />
					</div>
					<Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>
						<List id="lista" selectable ripple className="lista">
							{this.listClients()}
						</List>
					</Scrollbars>
				</div>

				<main id="container">
					<Top />
					<div id="wrapper">
						<div className="content">
							{this.props.children}
						</div>
					</div>
				</main>

				<Dialog actions={this.actions}
               active={this.state.dialog}
               className={styles.klijentDialog+' '+styles.removeDialog}
               onEscKeyDown={this.handleDialog}
               onOverlayClick={this.handleDialog}
               title='Brisanje klijenta'>
					<div>
						{'Da li ste sigurni da želite obrisati podatke o klijentu '+this.state.klijentToDelete+'?'}
					</div>
            </Dialog>
			</div>
		);
	}
}
