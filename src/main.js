import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import style from './custom/style.css'
import 'vuetify/dist/vuetify.css'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'






// Vue.use(Vuetify)
Vue.use(Vuetify, {
  theme: {
  	form_heading: '#868686',
    primary: '#2db18e',
    secondary: '#2196f3',
    accent: '#f1885f',
    error: '#da2424'
  }
})

Vue.config.productionTip = false
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  DateFilter,
  render: h => h(App),
  created () {
  	firebase.initializeApp({
  		apiKey: 'AIzaSyBaCDTYFQXAaBD4O0fnKRjJ_aKZ-mHGFFY',
      authDomain: 'vuematefire.firebaseapp.com',
      databaseURL: 'https://vuematefire.firebaseio.com',
      projectId: 'vuematefire',
      storageBucket: 'gs://vuematefire.appspot.com',
  	})
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoLogIn', user)
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
