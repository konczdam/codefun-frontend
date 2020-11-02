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
};
</script>
