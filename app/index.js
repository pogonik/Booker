// import React from 'react';
// import { render } from 'react-dom';
// import { Provider } from 'react-redux';
// import { Router, hashHistory } from 'react-router';
// import { Router, browserHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
// import routes from './routes';
// import configureStore from './store/configureStore';
// import './app.global.css';
//
// const store = configureStore();
// const history = syncHistoryWithStore(hashHistory, store);
//
//
// render(
//   <Provider store={store}>
//     <Router history={history} routes={routes} />
//   </Provider>,
//   document.getElementById('root')
// );
//
// render(<Router history={hashHistory} routes={routes} />,document.getElementById('root'));

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import routes from './routes';

import './app.global.css';

render(<Router history={hashHistory} routes={routes} />, document.getElementById('root'));
// render((
//    <Router history={hashHistory}>
//    	<Route path="/" component={Skelet}>
//    		<IndexRoute component={Fakture} />
//    		<Route path="racuni" component={Fakture}>
//    			<Route path="novo" component={FakturaNovoForm} />
//    			<Route path=":id" component={FakturaEditForm} />
//    		</Route>
//    		<Route path="klijenti" component={Klijenti}>
//    			<Route path="novo" component={KlijentNovoForm} />
//    			<Route path=":id" component={KlijentEditForm} />
//    		</Route>
//    	</Route>
//    </Router>
// ),document.getElementById('root'));
