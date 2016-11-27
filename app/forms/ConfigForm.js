import React, { Component, PropTypes } from 'react';

import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';

import Rebase from 're-base';

import { Router, Route, Link, browserHistory } from 'react-router';

import _ from 'lodash';
import { base } from '../utils/helpers';
import moment from 'moment';

export default class ConfigForm extends Component {

   static propTypes = {
   };

   static defaultProps = {
   };

   state = {
      config: [],
      klijenti: [],
      naziv: '',
      adresa: '',
      pib: '',
      mb: '',
      email: '',
      phone: '',
      logoUrl: '',
      logoRef: '',
      autor: ''
   };

   constructor(props) {
      super(props);
   }

   componentWillMount() {
      // let storageRef = base.storage().ref();
      // storageRef.child('images/fajl.png').getMetadata().then(data => {
      //    console.log(data);
      // });
      if(localStorage.autor) {
         this.setState({ autor:localStorage.autor });
      }
      base.syncState('config', {
         context: this,
         asArray: false,
			state: 'config'
      });
   }

   handleChange = (name, val) => {
      let config = this.state.config;
      config[name] = val;
      this.setState({config});

      if(name === 'autor') {
         this.setState({autor: val});
         localStorage.autor = val;
      }
   };

   resetForm() {
      this.setState({naziv: '', adresa: '', pib: '', mb: '', email: '', phone: ''});
   }

   uploadLogo = (e) => {
      let config = this.state.config;
      let storageRef = base.storage().ref();

      let name = this.refs.fajl.files[0].name;
      let dot = name.lastIndexOf('.');
      let ext = name.slice(dot);

      storageRef.child('images/logo'+ext).put(this.refs.fajl.files[0]).then(snapshot => {
         config['logoRef'] = 'images/fajl'+ext;
         config['logoUrl'] = snapshot.downloadURL;
         this.setState({ config });
         // console.log('adresa je:');
         // console.log(snapshot.downloadURL);
      });

      //console.log(ext);
      // console.log(e.target.value);
      // console.log(e.currentTarget.value);
   }

   render() {
      let logoUrl = this.state.config.logoUrl;
      let logo = '';
      if(logoUrl !== '' && logoUrl !== null && logoUrl !== undefined) {
         logo = <img src={logoUrl} width="100" />
      }
      return (
         <form>
            {logo}
            <br/><br/>
            <span>Logo firme</span>
            <input type="file" name="logo" ref="fajl" onChange={this.uploadLogo.bind(this)} />
            <br/>

            <Input type='text'
               label='Naziv firme' name='naziv'
               value={this.state.config.naziv}
               onChange={this.handleChange.bind(this, 'naziv')} />

            <Input type='text' multiline
               label='Adresa' name='adresa'
               value={this.state.config.adresa}
               onChange={this.handleChange.bind(this, 'adresa')} />

            <Input type='email'
               label='Email' name='email'
               value={this.state.config.email}
               onChange={this.handleChange.bind(this, 'email')} />

            <Input type='text'
               label='Telefon' name='phone'
               value={this.state.config.phone}
               onChange={this.handleChange.bind(this, 'phone')} />

            <Input type='text'
               label='PIB' name='pib'
               value={this.state.config.pib}
               onChange={this.handleChange.bind(this, 'pib')} />

            <Input type='text'
               label='Matični broj' name='mb'
               value={this.state.config.mb}
               onChange={this.handleChange.bind(this, 'mb')} />

            <Input type='text'
               label='Broj računa' name='racun'
               value={this.state.config.racun}
               onChange={this.handleChange.bind(this, 'racun')} />

            <Input type='text'
               label='Opšta PDV stopa' name='pdv'
               value={this.state.config.pdv}
               onChange={this.handleChange.bind(this, 'pdv')} />

            <Input type='text'
               label='Ime i prezime korisnika' name='autor'
               value={this.state.autor}
               onChange={this.handleChange.bind(this, 'autor')} />

         </form>
      );
   }
};
