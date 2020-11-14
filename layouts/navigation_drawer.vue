<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      enable-resize-watcher
      app
      absolute
    >
      <v-list>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                AA
              </v-list-item-title>
              BB
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      clipped-left
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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
