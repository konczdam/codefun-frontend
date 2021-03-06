<template>
  <div data-scroll-index="head">
    <v-app-bar
      app
      fixed
      dark
      clipped-left
      tabs
      elevate-on-scroll
      :color="'#000'"
    >
      <v-toolbar-title class="headline mr-5">
        codefun
      </v-toolbar-title>

      <v-toolbar-items>
        <template v-for="item in menu.left">
          <v-btn
            v-show="visible(item)"
            :key="item"
            :class="{ 'grey darken-3': isActive(item) }"
            text
            @click="navigate(item)"
          >
            {{ item }}
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <template v-for="item in menu.right">
          <v-btn
            v-show="visible(item)"
            :key="item"
            :class="{ 'grey darken-3': isActive(item) }"
            text
            @click="navigate(item)"
          >
            {{ item === 'user' ? userName : item }}
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TopMenu',
  data() {
    return {
      drawer: false,
      menu: {
        left: [
          'compete',
          'friends',
        ],
        right: [
          'login',
          'register',
          'challenges',
          'user',
          'logout',
        ]
      }
    };
  },
  computed: {
    userLoggedIn() {
      return this.$auth.loggedIn;
    },
    userName() {
      if (!this.userLoggedIn) {
        return null;
      }
      return this.$auth.user.username;
    },
  },
  methods: {
    ...mapActions({ disconnect: 'websocket/disconnect' }),
    async navigate(item) {
      if (item === 'logout') {
        await this.disconnect();
        await this.$auth.logout();
        this.$auth.$storage.removeUniversal('user');
        this.$notifier.showMessage({ content: this.$t('app.snackbar.successful_logout'), color: 'success' });
        this.$router.push({ name: 'login' });
      } else {
        this.$router.push({ name: item });
      }
    },
    visible(item) {
      switch (item) {
      case 'login':
      case 'register':
        return !this.userLoggedIn;
      case 'logout':
      case 'user':
      case 'compete':
      case 'friends':
        return this.userLoggedIn;
      case 'challenges':
        if (!this.userLoggedIn) {
          return false;
        }
        return this.$auth.user.roles.includes('ROLE_ADMIN');
      }
    },
    isActive(item) {
      return `/${item}` === this.$route.path;
    }
  },
};
</script>

<style scoped>
  a {
    text-decoration: none;
    color: inherit;
  }
</style>
