<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      disable-resize-watcher
      app
      absolute
    >
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      clipped-left
      dark
    >
      <v-toolbar-title> codefun</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
        <snackbar />
      </v-container>
    </v-main>
    <the-footer />
  </v-app>
</template>

<script>
import TheFooter from '@/components/TheFooter';
import Snackbar from '~/components/utils/Snackbar.vue';

export default {
  components: {
    Snackbar,
    TheFooter,
  },
  data() {
    return {
      drawer: false,
      clipped: true,
    };
  },
};
</script>
