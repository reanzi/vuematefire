<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" fixed temporary>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogOut">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer;">w-Meet</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
        {{ item.title }}</v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="onLogOut"> <v-icon left>exit_to_app</v-icon>Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-content>
        <router-view></router-view>
      </v-content>
    </main>
  </v-app>
</template>

<script>
export default {
data () {
return {
sideNav: false
}
},
computed: {
menuItems () {
let menuItems = [
{icon: 'face', title: 'Join Us', link: '/signup'},
{icon: 'lock_open', title: 'Log in', link: '/login'}
]
if (this.userIsAuthenticated) {
menuItems = [
{icon: 'supervisor_account', title: 'Meetups', link: '/meetups'},
{icon: 'room', title: 'Organize', link: '/meetup/new'},
{icon: 'person', title: 'Profile', link: '/profile'}
]
}
return menuItems
},
userIsAuthenticated () {
return this.$store.getters.user !== null && this.$store.getters.user !== undefined
}
},
methods: {
onLogOut () {
this.$store.dispatch('logout')
}
}
}
</script>
