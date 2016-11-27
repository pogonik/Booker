import React, {Component, PropTypes} from 'react';
import {Router, Route, Link, hashHistory} from 'react-router';

import { Button, IconButton } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import styles from '../styles/styles.scss';

import _ from 'lodash';
import { base } from '../utils/helpers';
import moment from 'moment';

import ConfigForm from '../forms/ConfigForm';
import DBForm from '../forms/DBForm';

const topBtn = {
	color: '#666666'
};

export default class Top extends Component {

	static propTypes = {};

   static defaultProps = {};

   state = {
		dialog: false,
		forma: 0,
		config: []
	};

   constructor(props) {
      super(props);
   }

	componentWillMount() {
      base.syncState('config', {
         context: this,
         asArray: false,
			state: 'config'
      });
   }

	openForm = (forma) => {
      this.setState({ forma }, this.handleDialog);
   };

	handleDialog = () => {
      this.setState({ dialog: !this.state.dialog });
   };

	render() {

		let forma = <ConfigForm ref="configForm" />;
		let naslov = "Podaci o kompaniji";
		if(this.state.forma === 1) {
			forma = <DBForm />;
			naslov = "Baza podataka";
		}
		return (
			<div id="top" className={"top "+styles.topBar}>

				<div className="row">
					<div className="col-xs-6 text-left">
						<IconButton icon='arrow_back'
							className={styles.topBtn}
							onClick={() => hashHistory.goBack()}
							neutral={false} />

						<IconButton icon='arrow_forward'
							className={styles.topBtn}
							onClick={() => hashHistory.goForward()}
							neutral={false} />
					</div>
					<div className="col-xs-6 text-right">
						<IconButton icon='storage'
							className={styles.topBtn}
							onClick={this.openForm.bind(this,1)}
							neutral={false} />

						<IconButton icon='settings'
							className={styles.topBtn}
							onClick={this.openForm.bind(this,0)}
							neutral={false} />
					</div>
				</div>

				<Dialog active={this.state.dialog}
					className={styles.klijentDialog}
					onEscKeyDown={this.handleDialog}
					onOverlayClick={this.handleDialog}
					title={naslov} type='normal'>
					{forma}
				</Dialog>

			</div>
		);
	}
}
