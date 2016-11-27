import React, { Component, PropTypes } from 'react';

import Autocomplete from 'react-toolbox/lib/autocomplete';
import { Button } from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import { Snackbar } from 'react-toolbox/lib/snackbar';

import { Scrollbars } from 'react-custom-scrollbars';

import _ from 'lodash';
import { base, localeSrpski, mesta } from '../utils/helpers';
import moment from 'moment';

import styles from '../styles/styles.scss';

import Usluge from '../components/Usluge';

export default class KoEditForm extends Component {

   static propTypes = {
   };

   static defaultProps = {
   };

   state = {
      racuni: [],
      racun: {},
      brojRacuna: '',
      config: {},
      broj: 0,
      punBroj: 0,
      datum: moment().toDate(),
      unixDate: moment().format('x'),
      mesto: '',
      klijent: '',
      usluge: [{ rb: 1, opis: '', cena: 0, pdv: 0, porez: 0, ukupno: 0 }],
      pdv: 20,
      snackbar: false,
      snackbarText: ''
   };

   constructor(props) {
      super(props);
   }

   componentWillMount() {
      let path = this.props.route.type+'/'+this.props.params.id;
      this.getData(path);
   }
   componentWillReceiveProps(nextProps) {
      let path = nextProps.route.type+'/'+nextProps.params.id;
      this.getData(path);
   }

   getData(path) {

      base.fetch(path, {
         context: this,
         asArray: false
      }).then(data => {
         this.setState({
            path: path,
            klijent: data.klijent,
            datum: data.datum,
            unixDate: data.unixDate,
            mesto: data.mesto,
            broj: data.broj,
            brojRacuna: data.brojRacuna,
            punBroj: data.punBroj,
            usluge: data.usluge,
            subtotal: data.subtotal,
            porez: data.porez,
            pdv: data.pdv,
            total: data.total
         }, this.getRacun(data.brojRacuna));
      });

      base.fetch('config', {
         context: this,
         asArray: false
      }).then(data => {
         this.setState({
            config: data,
            pdv: data.pdv
         });
      });

      base.fetch('racuni', {
         context: this,
         asArray: true
      }).then(data => {
         data.map(res => {
            this.setState({ racuni: this.state.racuni.concat(res.punBroj) });
         });
      });

   }

   getBrojRacuna(type) {
      //Broj poslednjeg racuna
      base.fetch(type, {
         context: this,
         queries: {
            limitToLast: 1
         }
      }).then(data => {
         let broj = '0001';
         if(data) {
            let lastKey = _.findLastKey(data, e => {
               let newNum = parseInt(e.broj) + 1;
               broj = _.padStart(newNum, 4, 0);
            });
         }
         this.setState({broj:broj, punBroj: broj+'-'+this.state.brojRacuna});
      });
   };

   getRacun(num) {
      base.fetch('racuni', {
         context: this,
         asArray: true,
         queries: {
            orderByChild: 'punBroj',
            equalTo: num,
            limitToFirst: 1
         }
      }).then(racun => {
         this.setState({ klijent: racun[0].klijent, racun:racun[0], punBroj: this.state.broj+'-'+racun[0].punBroj });
      });
   }

   handleChange = (name, val) => {
      this.setState({...this.state, [name]: val});
   };

   novaUsluga = () => {
      let rb = _.size(this.state.usluge) + 1;
      this.setState({ usluge: this.state.usluge.concat({ rb: rb, opis: '', cena: 0, pdv: this.state.pdv, porez: 0, ukupno: 0 }) });
   };

   handleUslugeChange = (row, key, e) => {
      let usluge = this.state.usluge;
      if(key === 'opis') {
         usluge[row][key] = e;
      }
      else if (key === 'cena') {
         usluge[row]['cena'] = _.round(e.target.textContent, 2);
         usluge[row]['pdv'] = parseInt(usluge[row]['pdv']);
         usluge[row]['porez'] = usluge[row]['cena'] * (usluge[row]['pdv'] / 100);
         usluge[row]['porez'] = _.round(usluge[row]['porez'], 2);
         usluge[row]['ukupno'] = usluge[row]['cena'] + usluge[row]['porez'];
         usluge[row]['ukupno'] = _.round(usluge[row]['ukupno'], 2);
      }
      else if (key === 'pdv') {
         usluge[row]['pdv'] = parseInt(e.target.textContent);
         usluge[row]['cena'] = _.round(usluge[row]['cena'], 2);
         usluge[row]['porez'] = usluge[row]['cena'] * (usluge[row]['pdv'] / 100);
         usluge[row]['porez'] = _.round(usluge[row]['porez'], 2);
         usluge[row]['ukupno'] = usluge[row]['cena'] + usluge[row]['porez'];
         usluge[row]['ukupno'] = _.round(usluge[row]['ukupno'], 2);
      } else {
         usluge[row][key] = e.target.textContent;
      }
      this.setState({usluge});
   };

   handleAutocomplete = (val) => {
      this.setState({brojRacuna:val});
      this.getRacun(val);
	};

   handleSnackbarTimeout = (e, i) => {
      this.setState({ snackbar: false });
   };

   removeUsluge(row) {
      let usluge = this.state.usluge;
      _.remove(usluge, (val, key) => {
         return key === row;
      });
      this.setState({usluge});
   };

   sacuvajFakturu = () => {
      let { subtotal, porez, pdv, total } = this.refs.usluge.state;
      let { broj, brojRacuna, punBroj, datum, usluge, racun } = this.state;

      let autor = localStorage.autor ? localStorage.autor : 'Nije navedeno';

      let data = {
         klijent: racun.klijent,
         datum: racun.datum1,
         unixDate: racun.unixDate,
         mesto: racun.mesto,
         broj: broj,
         brojRacuna: brojRacuna,
         punBroj: punBroj,
         usluge: usluge,
         subtotal: subtotal,
         porez: porez,
         pdv: pdv,
         total: total,
         autor: autor
      };
      base.post(this.state.path, { data:data }
      ).then(newData => {
         this.setState({ snackbar: true, snackbarText: 'Odobrenje je uspešno sačuvano!' });
         base.update('racuni/'+racun.key, {data:{ koKey: this.props.params.id, koBroj: broj }});
      });
   };

   handleInput = (e) => {
      let broj = e.target.value;
      if(!broj || broj === '') {
         this.getBrojRacuna('ko');
      } else {
         this.setState({broj:broj, punBroj: broj+'-'+this.state.racun.punBroj});
      }
   };

   render() {
      let naslov = 'Knjižno odobrenje broj ';
      let scrollAutoHeight = window.innerHeight - 90;

      let { broj, racuni, brojRacuna } = this.state;

      return (
         <div className={styles.fakturaForm}>

            <Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>
            <h1>
               {naslov}<br/>
            <input type="text" className={styles.naslovInput} placeholder={broj} onChange={this.handleInput} /> - {brojRacuna}
            </h1>

               <Autocomplete multiple={false}
                  direction="down"
                  selectedPosition="above"
                  label="Račun"
                  onChange={this.handleAutocomplete}
                  source={this.state.racuni}
                  theme={styles}
                  value={this.state.brojRacuna} />

               <div className={styles.uslugeWrapper}>

                  <Usluge data={this.state.usluge} ref="usluge"
                     onChange={this.handleUslugeChange}
                     removeRow={this.removeUsluge.bind(this)}
                     className={styles.uslugeTabela} />

                  <Button icon='add' floating accent mini
                     onClick={this.novaUsluga}
                     className={styles.newClientDialogBtn} />
               </div>

               <div className={styles.saveBtnWrapper}>
                  <Button icon='save' label='Sačuvaj' raised primary onClick={this.sacuvajFakturu} className={styles.saveBtn} />
               </div>

            </Scrollbars>

            <Snackbar action='Dismiss'
               active={this.state.snackbar}
               icon='question_answer'
               label={this.state.snackbarText}
               type='cancel'
               onTimeout={this.handleSnackbarTimeout}
               timeout={2000} />

         </div>
      );
   }
};
