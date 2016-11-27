import React from 'react';
// import {Route, IndexRoute} from 'react-router';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import App from './containers/App';
import Skelet from './containers/Skelet';
import Klijenti from './components/Klijenti';
import KlijentData from './components/KlijentData';
import Fakture from './components/Fakture';
import FakturaData from './components/FakturaData';
import KlijentNovoForm from './forms/KlijentNovoForm';
import KlijentEditForm from './forms/KlijentEditForm';
import FakturaNovoForm from './forms/FakturaNovoForm';
import FakturaEditForm from './forms/FakturaEditForm';
import KoEditForm from './forms/KoEditForm';
import KoNovoForm from './forms/KoNovoForm';
import Home from './components/Home';
import Arhiva from './components/Arhiva';
import Izvestaj from './components/Izvestaj';
import IzvestajData from './components/IzvestajData';
import Odobrenja from './components/Odobrenja';
import OdobrenjeData from './components/OdobrenjeData';
import Print from './components/Print';
import PrintKo from './components/PrintKo';

export default(
	<Route path="/" component={Skelet}>
		<IndexRoute component={Home} />

		<Route path="klijenti" component={Klijenti}>
			<Route path="novo" component={KlijentNovoForm} />
			<Route path=":id" component={KlijentData} />
			<Route path="edit/:id" component={KlijentEditForm} />
		</Route>

		<Route path="racuni" type="racuni" component={Fakture}>
			<Route path="novo" type="racuni" component={FakturaNovoForm} />
			<Route path=":id" type="racuni" component={FakturaData} />
			<Route path="edit/:id" type="racuni" component={FakturaEditForm} />
		</Route>

		<Route path="predracuni" type="predracuni" component={Fakture}>
			<Route path="novo" type="predracuni" component={FakturaNovoForm} />
			<Route path=":id" type="predracuni" component={FakturaData} />
			<Route path="edit/:id" type="predracuni" component={FakturaEditForm} />
		</Route>

		<Route path="ponude" type="ponude" component={Fakture}>
			<Route path="novo" type="ponude" component={FakturaNovoForm} />
			<Route path=":id" type="ponude" component={FakturaData} />
			<Route path="edit/:id" type="ponude" component={FakturaEditForm} />
		</Route>

		<Route path="ko" type="ko" component={Odobrenja}>
			<Route path="novo" type="ko" component={KoNovoForm} />
			<Route path=":id" type="ko" component={OdobrenjeData} />
			<Route path="edit/:id" type="ko" component={KoEditForm} />
		</Route>

		<Route path="arhiva" component={Arhiva} />

		<Route path="izvestaji" type="izvestaji" component={Izvestaj}>
			<Route path=":id" type="izvestaji" component={IzvestajData} />
		</Route>

		<Route path="print/ko/:id" type="print" component={PrintKo} />

		<Route path="print/:type/:id" type="print" component={Print} />

	</Route>
);
