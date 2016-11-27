import React, { Component, PropTypes } from 'react';

import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';

import { bazaPath, config } from '../utils/helpers';

import styles from '../styles/styles.scss';
var fs = require('fs');
var app = require('electron').remote;

export default class DBForm extends Component {

   static propTypes = {
   };

   static defaultProps = {
   };

   state = {
      baza: {}
   };

   constructor(props) {
      super(props);
   }

   componentWillMount() {
      // let baza = fs.readFileSync(bazaPath, 'utf-8');
      if(config && !_.isEmpty(config)) {
         this.setState({ baza:config });
      }
   }

   handleChange = (name, val) => {
      let newConfig = this.state.baza;
      newConfig[name] = val;
      this.setState({ baza:newConfig });
   };

   saveData = (e) => {
      e.preventDefault();
      let data = {
         "apiKey": this.state.baza.apiKey,
         "authDomain": this.state.baza.authDomain,
         "databaseURL": this.state.baza.databaseURL,
         "storageBucket": this.state.baza.storageBucket
      };

      fs.writeFile(bazaPath, JSON.stringify(this.state.baza), (err,data) => {
         app.getCurrentWindow().reload();
      });

   };

   render() {
      return (
         <form id="dataForm">

            <Input type='text'
               label='apiKey' value={this.state.baza.apiKey}
               onChange={this.handleChange.bind(this, 'apiKey')} />

            <Input type='text'
               label='authDomain' value={this.state.baza.authDomain}
               onChange={this.handleChange.bind(this, 'authDomain')} />

            <Input type='text'
               label='databaseURL' value={this.state.baza.databaseURL}
               onChange={this.handleChange.bind(this, 'databaseURL')} />

            <Input type='text'
               label='storageBucket' value={this.state.baza.storageBucket}
               onChange={this.handleChange.bind(this, 'storageBucket')} />

            <div className={styles.saveBtnWrapper} style={{marginTop:'40px'}}>
               <Button label='Sačuvaj' raised primary onClick={this.saveData} className={styles.saveBtn} />
            </div>

         </form>
      );
   }
};
