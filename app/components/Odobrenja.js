import React, {Component, PropTypes} from 'react';

import {Router, Route, Link, hashHistory} from 'react-router';
import Fuse from 'fuse.js';
import _ from 'lodash';
import {base} from '../utils/helpers';
import moment from 'moment';

import Input from 'react-toolbox/lib/input';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import {Button} from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Dialog from 'react-toolbox/lib/dialog';
import { Scrollbars } from 'react-custom-scrollbars';

import Top from '../components/Top';

import styles from '../styles/styles.scss';

const searchOptions = {
	shouldSort: true,
	threshold: 0.2,
	distance: 200,
	maxPatternLength: 32,
	keys: ["proj", "punBroj", "klijent", "datum1", "usluge.opis"]
};

export default class Odobrenja extends Component {

	static propTypes = {
   };

   static defaultProps = {
   };

   state = {
      fakture: null,
      naziv: '',
      adresa: '',
      pib: '',
      mb: '',
		searchTerm: '',
		dialog: false,
		itemToDelete: null,
		fakturaToDelete: '',
		path: '',
      editPath: '',
   };

   constructor(props) {
      super(props);
   }

	componentWillMount() {

		let path = this.props.route.type;
      let editPath = '/'+this.props.route.type+'/edit/'+this.props.params.id;

      this.setState({ path, editPath });

		this.ref = base.bindToState(path, {
			context: this,
			state: 'fakture',
			asArray: true,
			queries: {
				orderByValue: 'broj'
			}
		});
		// this.setState({ path, editPath });
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	componentWillReceiveProps(nextProps) {

		base.removeBinding(this.ref);

		let path = nextProps.route.type;
      let editPath = '/'+nextProps.route.type+'/edit/'+nextProps.params.id;

      this.setState({ path, editPath });

		this.ref = base.bindToState(path, {
			context: this,
			state: 'fakture',
			asArray: true,
			queries: {
				orderByValue: 'broj'
			}
		});
	}

	updateSearch = (name, val) => {
		this.setState({...this.state, [name]: val});
	}

	handleDialog = () => {
		this.setState({ dialog: !this.state.dialog });
	}

	removeWarning = (val) => {
		let fakturaToDelete = this.state.fakture[val];
		this.setState({ fakturaToDelete: fakturaToDelete.punBroj, itemToDelete: fakturaToDelete.key, dialog: true });
	}

	removeConfirm = () => {
		let { path, itemToDelete } = this.state;
		base.database().ref(path+'/'+itemToDelete).remove();
		this.setState({ dialog: false });
	}

	actions = [
      { label: "Odustani", onClick: this.handleDialog },
      { label: "Obriši", onClick: this.removeConfirm}
   ];

	gotoEdit = (key) => {
		hashHistory.push('/ko/edit/'+key);
	}

	listFakture() {
		let result = this.state.fakture;
		if(this.state.searchTerm !== '') {
			const fuse = new Fuse(this.state.fakture, searchOptions);
			result = fuse.search(this.state.searchTerm);
		}
		return _.map(result, (val, key) => {
			let caption = val.punBroj+' - '+val.klijent;
			caption = _.truncate(caption, { 'length':35 });

			let opis = val.usluge ? val.usluge[0].opis : '';
			opis = _.truncate(opis, { 'length':35 });

			let rightMenu = [
				<IconMenu key={val.key} icon='more_vert' position='topRight' menuRipple>
					<MenuItem icon='edit' caption='Izmeni' onClick={this.gotoEdit.bind(this,val.key)} />
					<MenuDivider />
					<MenuItem icon='delete' caption='Obriši' onClick={this.removeWarning.bind(this,key)} />
				</IconMenu>
			];

			return (
				<Link key={key} to={'/'+this.props.route.type+'/'+val.key} activeClassName="active">
					<ListItem caption={caption} legend={opis} rightActions={rightMenu} />
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
							{this.listFakture()}
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
               title='Brisanje fakture'>
					<div>
						{'Da li ste sigurni da želite obrisati fakturu broj '+this.state.fakturaToDelete+'?'}
					</div>
            </Dialog>

			</div>
		);
	}
}
