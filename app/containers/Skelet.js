import React, {Component, PropTypes} from 'react';
import {AppBar, Checkbox} from 'react-toolbox';
import {Layout, NavDrawer, Panel, Sidebar} from 'react-toolbox';
import { Link, IndexLink, hashHistory } from 'react-router';
import {Button, IconButton} from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import { PredracunIcon, RacunIcon, ArhivaIcon } from '../components/Icons';

import styles from '../styles/styles.scss';

import { Logo } from '../components/Icons';

export default class Skelet extends Component {
	state = {
		drawerActive: false,
		drawerPinned: false,
		sidebarPinned: false
	};

   constructor(props) {
      super(props);
   }

	toggleSidebar = () => {
		this.setState({
			sidebarPinned: !this.state.sidebarPinned
		});
	};

	render() {
		let klasa = this.props.location.pathname === '/' ? 'home' : 'root';

		let aside = <aside id="sidebar">
			<div id="logo">
				<IndexLink to="/"><Logo fill="#FFFFFF" width="32" /></IndexLink>
			</div>

			<nav className={styles.asideNav}>
				<Link to="/klijenti/novo" activeClassName="active">
					<FontIcon value='group' className={styles.fontIcon} />
					<span className={styles.text}>Klijenti</span>
				</Link>

				<Link to="/racuni/novo" activeClassName="active">
					<RacunIcon fill='#FFFFFF' className={styles.icon} />
					<span className={styles.text}>Računi</span>
				</Link>

				<Link to="/predracuni/novo" activeClassName="active">
					<PredracunIcon fill='#FFFFFF' className={styles.icon} />
					<span className={styles.text}>Predračuni</span>
				</Link>

				<Link to="/ponude/novo" activeClassName="active">
					<FontIcon value='assignment' className={styles.fontIcon} />
					<span className={styles.text}>Ponude</span>
				</Link>

				<Link to="/ko/novo" activeClassName="active">
					<FontIcon value='local_library' className={styles.fontIcon} />
					<span className={styles.text}>Knjižna o.</span>
				</Link>

				<Link to="/arhiva" activeClassName="active">
					<ArhivaIcon fill='#FFFFFF' className={styles.icon} />
					<span className={styles.text}>Arhiva</span>
				</Link>

				<Link to="/izvestaji" activeClassName="active">
					<FontIcon value='timeline' className={styles.fontIcon} />
					<span className={styles.text}>Izveštaji</span>
				</Link>

			</nav>
		</aside>;

		if(this.props.location.pathname === '/' || this.props.routes[1].type === 'print') {
			aside = '';
		}

		return (
			<Layout className={klasa}>
				<Panel className={styles.root_panel}>

					{aside}

					{this.props.children}

				</Panel>
				<Sidebar pinned={this.state.sidebarPinned} width={5}>
					<div><IconButton icon='close' onClick={this.toggleSidebar}/></div>
				</Sidebar>
			</Layout>
		);
	}
}
