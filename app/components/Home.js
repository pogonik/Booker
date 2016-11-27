import React, {Component} from 'react';
import { Link, hashHistory } from 'react-router';
import FontIcon from 'react-toolbox/lib/font_icon';
import {IconButton} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';

import { PredracunIcon, RacunIcon } from './Icons';

import DBForm from '../forms/DBForm';

import styles from './Home.css';

var fs = require('fs');
import { bazaPath, config } from '../utils/helpers';

export default class Home extends Component {

	state = {
		dialog: false
	};

	componentWillMount() {
		// let baza = fs.readFileSync(bazaPath, 'utf-8');
      if(!config || _.isEmpty(config)) {
         this.setState({ dialog:true });
      }
   }

	handleDialog = () => {
      this.setState({ dialog: !this.state.dialog });
   };

	render() {

		return (

			<div id="home" className="content" style={{width:'100%'}}>

				<nav className={styles.nav}>

					<img src="app.png" className={styles.logo} />

					<div className={styles.linkWrapper}>
						<Link to="/klijenti/novo" className={styles.link+' '+styles.link1}>
							<FontIcon value='group' className={styles.icon} />
							<span className={styles.text}>Klijenti</span>
						</Link>

						<Link to="/racuni/novo" className={styles.link+' '+styles.link2}>
							<RacunIcon className={styles.icon} />
							<span className={styles.text}>Računi</span>
						</Link>

						<Link to="/predracuni/novo" className={styles.link+' '+styles.link3}>
							<PredracunIcon className={styles.icon} />
							<span className={styles.text}>Predračuni</span>
						</Link>

						<Link to="/ponude/novo" className={styles.link+' '+styles.link4}>
							<FontIcon value='assignment' className={styles.icon} />
							<span className={styles.text}>Ponude</span>
						</Link>
					</div>

				</nav>

				<Dialog active={this.state.dialog}
					className={styles.klijentDialog}
					onEscKeyDown={() => { return false; }}
					onOverlayClick={() => { return false; }}
					title="Baza podataka" type='normal'>
					<DBForm />
				</Dialog>

			</div>
		);
	}
}
