import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		loadedMeetups: [
		 // {imageUrl: 'https://st2.depositphotos.com/1753052/8425/i/950/depositphotos_84259822-stock-photo-the-amazon-forest-in-brazil.jpg',
		 // 	id: '1234ssdd',
		 // 	title: 'Meetup',
		 // 	location: 'Bagamoyo',
		 // 	description: 'Waaaalaaah, it\'s tooo amaizing out here Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus a, perferendis reprehenderit consequuntur sapiente, voluptatum nobis cupiditate cum, ab architecto atque, tempore sint! Amet ipsa, voluptas maiores commodi error officia.',
		 // 	date: new Date()
		 // },
   //       {imageUrl: 'https://i.ytimg.com/vi/ANxvQHuW9S8/maxresdefault.jpg',
   //       	id: '223244ff',
   //       	title: 'Waaaalaaah',
   //       	location: 'Buswelu',
   //       	description: 'Waaaalaaah, it\'s tooo Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas illum excepturi consequatur cumque temporibus maxime at quaerat nihil sint, ut doloremque. Esse architecto illo odit facere deleniti nostrum exercitationem praesentium? amaizing out here',
   //       	date: new Date()
   //       },
   //       {imageUrl: 'https://static.pexels.com/photos/358382/pexels-photo-358382.jpeg',
   //       	id: '223244fkkf',
   //       	title: 'Somewhere awesome',
   //       	location: 'Kigoma',
   //       	description: 'Waaaalaaah, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, illum consectetur veritatis harum assumenda libero reprehenderit repudiandae natus corrupti, quae qui cupiditate, a facilis aperiam debitis praesentium neque temporibus officia! it\'s tooo amaizing out here',
   //       	date: new Date()
   //       }
		],
		user: null,
		loading: false,
		error: null
	},
	mutations: {
		setLoadedMeetups (state, payload) {
			state.loadedMeetups = payload
		},
		createMeetup (state, payload) {
			state.loadedMeetups.push(payload)
		},
		updateMeetup (state, payload) {
			const meetup = state.loadedMeetups.find(meetup => {
				return meetup.id === payload.id
			})
			if (payload.title) {
				meetup.title.id = payload.title
			}
			if (payload.description) {
				meetup.description = payload.description
			}
			if (payload.date) {
				meetup.date = payload.date
			}
		},
		setUser (state, payload) {
			state.user = payload
		},
		setLoading (state, payload) {
			state.loading = payload
		},
		setError (state, payload) {
			state.error =payload
		},
		clearError (state) {
			state.error = null
		}
	},
	actions: {
		loadMeetups ({commit}) {
			commit('setLoading', true)
			firebase.database().ref('meetups').once('value')
			.then((data) => {
				const meetups = []
				const obj = data.val()
				for (let key in obj) {
					meetups.push({
						id: key,
						title: obj[key].title,
						description: obj[key].description,
						imageUrl: obj[key].imageUrl,
						date: obj[key].date,
						location: obj[key].location,
						creatorId: obj[key].creatorId
					})
				}
				commit('setLoadedMeetups', meetups)
				commit('setLoading', false)
			})
			.catch(
				(error) => {
					console.log(error)
					commit('setLoading', false)
				}
			)
		},
		createMeetup ({commit, getters}, payload) {
			const meetup = {
				title: payload.title,
				location: payload.location,
				description: payload.description,
				date: payload.date.toISOString(),
				creatorId: getters.user.id
			}
			let imageUrl
			let key
			firebase.database().ref('meetups').push(meetup)
			.then((data) => {
				key = data.key
			    return key
			})
			.then(key => {
				const filename = payload.image.name
				const ext = filename.slice(filename.lastIndexOf('.'))
				return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
			})
			.then(fileData => {
				imageUrl = fileData.metadata.downloadURLs[0]
				return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
			})
			.then(() => {
				commit('createMeetup', {
			    	...meetup,
			    	imageUrl: imageUrl,
			    	id: key
			    })
			})
			.catch((error) => {
				console.log(error)
			})
			//Reach out to firebase and Store the data(paylooad)
			
		},
		updateMeetupData ({commit}, payload) {
			commit('setLoading', true)
			const updateObj = {}
				if (payload.title) {
					updateObj.title = payload.title
				}
				if (payload.description) {
					updateObj.description = payload.description
				}
				if (payload.date) {
					updateObj.date = payload.date
				}
				firebase.database().ref('meetups').child(payload.id).update(updateObj)
				.then(() => {
					commit('setLoading', false)
					commit('updateMeetup', payload)
				})
				.catch(error => {
					console.log(error)
					commit('setLoading', false)
				})
			
		},
		signUserUp ({commit}, payload) {
			commit('setLoading', true)
			commit('clearError')
			firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
			.then(
				  user => {
					commit('setLoading', false)
				  	const newUser = {
				  		id: user.uid,
				  		registerdMeetups: []
				  	}
				  	commit('setUser', newUser)
				  }
				)
				.catch( error => {
					commit('setLoading', false)
					commit('setError', error)
					console.log(error)
					}
				)
		},
		signUserIn ({commit}, payload) {
			commit('setLoading', true)
			commit('clearError')
			firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
			.then(
				user => {
					commit('setLoading', false)
					const newUser = {
						id: user.uid,
						registerdMeetups: []
					}
					commit('setUser', newUser)
				})
			.catch(  
				error => {
				commit('setLoading', false)
				commit('setError', error)
				console.log(error)
			  } 
			)
		},
		autoLogIn ({commit}, payload) {
			commit('setUser', {id: payload.uid, registerdMeetups: []})
		},
		logout ({commit}) {
			firebase.auth().signOut()
			commit('setUser', null)
		},
		clearError ({commit}) {
		commit('clearError')
		}
	},
	getters: {
		loadedMeetups (state) {
			return state.loadedMeetups.sort((meetupA, meetupB) => {
				return meetupA.date > meetupB.date
			})
		},
		featuredMeetups (state, getters) {
			return getters.loadedMeetups.slice(0, 5)
		},
		loadedMeetup (state) {
			return (meetupId) => {
				return state.loadedMeetups.find((meetup) => {
					return meetup.id === meetupId
				})
			}
 	},
  user (state) {
    return state.user
  },
  loading (state) {
  	return state.loading
  },
  error (state) {
  	return state.error
  }
}
})
