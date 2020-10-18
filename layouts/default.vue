<template>
  <v-app>
    <top-menu />
    <v-main>
      <v-container>
        <nuxt />
        <snackbar />
      </v-container>
    </v-main>
    <v-footer>
      AAA
    </v-footer>
  </v-app>
</template>

<script>
import TopMenu from '~/components/TopMenu';
import Snackbar from '~/components/utils/Snackbar.vue';

export default {
  components: {
    TopMenu,
    Snackbar,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    };
  }
};
</script>
