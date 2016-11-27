import React, { Component, PropTypes } from 'react';

import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';

import Rebase from 're-base';

import { Router, Route, Link, hashHistory } from 'react-router';

import _ from 'lodash';
import { base } from '../utils/helpers';
import moment from 'moment';
import styles from '../styles/styles.scss';

export default class KlijentEditForm extends Component {

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
      racun: '',
      snackbar: false,
      snackbarText: ''
   };

   constructor(props) {
      super(props);
   }

   componentWillReceiveProps(nextProps) {
      base.fetch('klijenti/'+nextProps.params.id, {
         context: this,
         asArray: false
      }).then(data => {
         this.setState({adresa: data.adresa, naziv: data.naziv, pib: data.pib, mb: data.mb, racun: data.racun});
      });
   }

   componentWillMount() {
      base.fetch('klijenti/'+this.props.params.id, {
         context: this,
         asArray: false
      }).then(data => {
         this.setState({adresa: data.adresa, naziv: data.naziv, pib: data.pib, mb: data.mb, racun: data.racun});
      });
   }

   handleChange = (name, val) => {
      this.setState({...this.state, [name]: val});
   };

   resetForm() {
      this.setState({naziv: '', adresa: '', pib: '', mb: '', racun: ''});
   }

   handleSnackbarTimeout = (e, i) => {
      this.setState({ snackbar: false });
   };

   submitKlijenti = (e) => {
      e.preventDefault();
      let { naziv, adresa, pib, mb, racun } = this.state;
      let data = { naziv:naziv, adresa:adresa, pib:pib, mb:mb, racun:racun};
      base.post(
         'klijenti/'+this.props.params.id, { data:data }
      ).then(res => {
         this.setState({ snackbar: true, snackbarText: 'Podaci o klijentu su uspešno izmenjeni!' });
         // this.resetForm();
      });
   };

   render() {
      return (
         <form>

            <h1>Izmena klijenta</h1>

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
               label='Tekući račun' name='racun'
               value={this.state.racun}
               onChange={this.handleChange.bind(this, 'racun')} />

            <div className={styles.saveBtnWrapper} style={{marginTop:'40px'}}>
               <Button label='Sačuvaj' raised primary onClick={this.submitKlijenti} className={styles.saveBtn} />
            </div>

            <Snackbar action='Dismiss'
               active={this.state.snackbar}
               icon='question_answer'
               label={this.state.snackbarText}
               type='cancel'
               onTimeout={this.handleSnackbarTimeout}
               timeout={2000} />
         </form>
      );
   }
};
