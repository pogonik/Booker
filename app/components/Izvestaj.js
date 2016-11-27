import React, {Component, PropTypes} from 'react';
import {Router, Route, Link, hashHistory} from 'react-router';

import Input from 'react-toolbox/lib/input';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Top from './Top';
import { Scrollbars } from 'react-custom-scrollbars';

import Fuse from 'fuse.js';
import _ from 'lodash';
import { base, localeSrpski, mesta } from '../utils/helpers';
import moment from 'moment';

import styles from '../styles/styles.scss';

const searchOptions = {
	// caseSensitive: true,
	// include: ["matches","score"],
	// shouldSort: true,
	// tokenize: true,
	// matchAllTokens: true,
	shouldSort: true,
	threshold: 0.2,
	// location: 0,
	distance: 200,
	maxPatternLength: 32,
	keys: ["naziv","adresa","pib"]
};

export default class Izvestaj extends Component {

   state = {
      klijenti: [],
      searchTerm: ''
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

   listClients() {
		let result = this.state.klijenti;
		if(this.state.searchTerm !== '') {
			const fuse = new Fuse(this.state.klijenti, searchOptions);
			result = fuse.search(this.state.searchTerm);
		}

		return result.map((val, key) => {

			let caption = _.truncate(val.naziv, { 'length':35 });

			let legend = _.truncate(val.adresa, { 'length':35 });

		   return (
		      <Link key={key} to={'/izvestaji/'+val.pib} activeClassName="active">
		         <ListItem caption={caption} legend={legend} />
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

			</div>
		);
	}
}
