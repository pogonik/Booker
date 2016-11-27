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

import KlijentNovoFormDialog from './KlijentNovoFormDialog';

export default class FakturaNovoForm extends Component {

   static propTypes = {
   };

   static defaultProps = {
   };

   state = {
      klijenti: [],
      type: null,
      broj: 0,
      punBroj: 0,
      datum1: moment().toDate(),
      datum2: moment().toDate(),
      datum3: moment().toDate(),
      datum4: moment().add(2,'months').toDate(),
      unixDate: moment().format('x'),
      mesto: '',
      klijent: '',
      pib: 0,
      usluge: [],
      dialog: false,
      pdv: 20,
      snackbar: false,
      snackbarText: ''
   };

   constructor(props) {
      super(props);
   }

   componentWillMount() {
      this.getData(this.props.route.type);
   }
   componentWillReceiveProps(nextProps) {
      this.getData(nextProps.route.type);
   }

   getData(type) {

      base.fetch('config', {
         context: this,
         asArray: false
      }).then(data => {
         this.setState({
            usluge: [{ rb: 1, opis: '', cena: 0, pdv: data.pdv, porez: 0, ukupno: 0 }],
            pdv: data.pdv
         });
      });

      base.fetch('klijenti', {
         context: this,
         asArray: true
      }).then(data => {
         data.map(res => {
            this.setState({ klijenti: this.state.klijenti.concat(res.naziv) });
         });
      });

      // Broj poslednjeg racuna
      base.fetch(type, {
         context: this,
         queries: {
            limitToLast: 1
         }
      }).then(data => {
         if(data) {
            let lastKey = _.findLastKey(data, e => {
               let newNum = parseInt(e.broj) + 1;
               let broj = _.padStart(newNum, 4, 0);
               let punBroj = broj+"/"+moment().format('YYYY');
               this.setState({ broj: broj, punBroj: punBroj, type: type });
            });
         } else {
            let broj = '0001';
            let punBroj = broj+"/"+moment().format('YYYY');
            this.setState({ broj: broj, punBroj: punBroj, type: type });
         }

      });

   }

   handleChange = (name, val) => {
      this.setState({...this.state, [name]: val});
   };

   handleDialog = () => {
      this.setState({ dialog: !this.state.dialog });
   };

   novaUsluga = () => {
      let rb = this.state.usluge.length + 1;
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
      base.fetch('klijenti', {
         context: this,
         asArray: true,
         queries: {
            orderByChild: 'naziv',
            equalTo: val,
            limitToFirst: 1
         }
      }).then(data => {
         this.setState({klijent: val, pib: data[0].pib});
      });
	};

   handleMesto = (val) => {
      this.setState({mesto: val});
	};

   saveClient = () => {
      let { naziv, adresa, pib, mb, racun } = this.refs.dialogForm.state;
      let data = { naziv: naziv, adresa: adresa, pib: pib, mb: mb, racun: racun };

      base.push(
         'klijenti', { data:data }
      ).then(data => {
         this.setState({
            dialog: !this.state.dialog,
            klijent: naziv,
            pib: pib
         });
      });
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

   actions = [
      { label: "Odustani", onClick: this.handleDialog },
      { label: "Sačuvaj", onClick: this.saveClient }
   ];

   resetForm() {
      base.fetch(this.state.type, {
         context: this,
         queries: {
            limitToLast: 1
         }
      }).then(data => {
         let lastKey = _.findLastKey(data, e => {
            let newNum = parseInt(e.broj) + 1;
            let broj = _.padStart(newNum, 4, 0);
            let punBroj = broj+"/"+moment().format('YYYY');
            this.setState({
               broj: broj,
               punBroj: punBroj,
               datum1: moment().toDate(),
               datum2: moment().toDate(),
               datum3: moment().add(2,'months').toDate(),
               datum4: new Date(),
               unixDate: moment().format('x'),
               mesto: '',
               klijent: '',
               pib: 0,
               usluge: [{ rb: 1, opis: '', cena: 0, pdv: this.state.pdv, porez: 0, ukupno: 0 }],
               dialog: false,
               pdv: 20
            });
         });
      });
   }

   sacuvajFakturu = () => {
      let { subtotal, porez, pdv, total } = this.refs.usluge.state;
      let { broj, punBroj, datum1, datum2, datum3, datum4, mesto, klijent, pib, usluge } = this.state;

      let autor = localStorage.autor ? localStorage.autor : 'Nije navedeno';

      let data = {
         broj: broj,
         punBroj: punBroj,
         datum1: moment(datum1).format('DD.MM.YYYY'),
         datum2: moment(datum2).format('DD.MM.YYYY'),
         datum3: moment(datum3).format('DD.MM.YYYY'),
         datum4: moment(datum4).format('DD.MM.YYYY'),
         unixDate: moment(datum1, 'DD.MM.YYYY').format('x'),
         mesto: mesto,
         klijent: klijent,
         pib: pib,
         usluge: usluge,
         subtotal: subtotal,
         porez: porez,
         pdv: pdv,
         total: total,
         autor: autor
      };
      base.push(
         this.state.type, { data:data }
      ).then(data => {
         this.setState({ snackbar: true, snackbarText: 'Faktura je uspešno izmenjena!' });
         this.resetForm();
      });
   };

   render() {

      let naslov = 'Nova faktura broj '+this.state.punBroj;
      let scrollAutoHeight = window.innerHeight - 90;
      return (
         <div className={styles.fakturaForm}>
            <Scrollbars autoHide autoHeight autoHeightMin={scrollAutoHeight}>
            <h1>{naslov}</h1>

            <div style={{position:'relative',marginBottom:'20px'}}>
               <Autocomplete multiple={false}
                  direction="down"
                  selectedPosition="above"
                  label="Klijent"
                  onChange={this.handleAutocomplete}
                  source={this.state.klijenti}
                  theme={styles}
                  value={this.state.klijent} />
               <Button icon='add' floating accent mini
                  onClick={this.handleDialog}
                  className={styles.newClientDialogBtn} />
            </div>

            <div className={styles.datePickerFaktura}>
               <DatePicker autoOk label='Datum izdavanja'
                  locale={localeSrpski}
                  onChange={this.handleChange.bind(this, 'datum1')}
                  value={this.state.datum1}
                  inputFormat={val => { return moment(val).format('DD.MM.YYYY')}} />
            </div>

            <div className={styles.datePickerFaktura}>
               <DatePicker autoOk label='Datum prometa usluga'
                  locale={localeSrpski}
                  onChange={this.handleChange.bind(this, 'datum2')}
                  value={this.state.datum2}
                  className={styles.datePickerFaktura}
                  inputFormat={val => { return moment(val).format('DD.MM.YYYY')}} />
            </div>

            <div className={styles.datePickerFaktura}>
               <DatePicker autoOk label='DPO'
                  locale={localeSrpski}
                  onChange={this.handleChange.bind(this, 'datum3')}
                  value={this.state.datum3}
                  className={styles.datePickerFaktura}
                  inputFormat={val => { return moment(val).format('DD.MM.YYYY')}} />
            </div>

            <div className={styles.datePickerFaktura2}>
               <DatePicker autoOk label='Rok plaćanja'
                  locale={localeSrpski}
                  onChange={this.handleChange.bind(this, 'datum4')}
                  value={this.state.datum4}
                  className={styles.datePickerFaktura2}
                  inputFormat={val => { return moment(val).format('DD.MM.YYYY')}} />
            </div>

            <div className={styles.clear}></div>

            <Autocomplete multiple={false}
               direction="down"
               selectedPosition="above"
               label="Mesto izdavanja"
               onChange={this.handleMesto}
               source={mesta} theme={styles}
               className={styles.autocompleteMesto}
               value={this.state.mesto} />

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

            <Dialog actions={this.actions}
               active={this.state.dialog}
               className={styles.klijentDialog}
               onEscKeyDown={this.handleDialog}
               onOverlayClick={this.handleDialog}
               title='Novi klijent'>
               <KlijentNovoFormDialog ref="dialogForm" />
            </Dialog>

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
