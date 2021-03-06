import React, { Component, PropTypes } from 'react';

import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';

import { Router, Route, Link, hashHistory } from 'react-router';

import _ from 'lodash';
import { base } from '../utils/helpers';
import moment from 'moment';

export default class KlijentNovoFormDialog extends Component {

   static propTypes = {
   };

   static defaultProps = {
   };

   state = {
      klijenti: [],
      naziv: '',
      adresa: '',
      pib: '',
      mb: '',
      racun: ''
   };

   constructor(props) {
      super(props);
   }

   componentWillMount() {
      base.bindToState('klijenti', {
         context: this,
         asArray: true,
         state: 'klijenti'
      });
   }

   handleChange = (name, value) => {
      this.setState({...this.state, [name]: value});
   };

   resetForm() {
      this.setState({naziv: '', adresa: '', pib: '', mb: '', racun: ''});
   }

   submitKlijenti = (e) => {
      e.preventDefault();
      let { naziv, adresa, pib, mb, racun } = this.state;
      let data = { naziv: naziv, adresa: adresa, pib: pib, mb: mb, racun: racun};
      this.props.onFormSaved.bind(data);
   };

   render() {
      return (
         <form>

            <Input type='text'
               label='Naziv klijenta' name='naziv'
               value={this.state.naziv}
               onChange={this.handleChange.bind(this, 'naziv')} />

            <Input type='text' multiline
               label='Adresa' name='adresa'
               value={this.state.adresa}
               onChange={this.handleChange.bind(this, 'adresa')} />

            <Input type='text'
               label='PIB' name='pib'
               value={this.state.pib}
               onChange={this.handleChange.bind(this, 'pib')} />

            <Input type='text'
               label='Matični broj' name='mb'
               value={this.state.mb}
               onChange={this.handleChange.bind(this, 'mb')} />

            <Input type='text'
               label='Broj računa' name='racun'
               value={this.state.racun}
               onChange={this.handleChange.bind(this, 'racun')} />

         </form>
      );
   }
};
