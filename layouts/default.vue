<template>
  <v-app>
    <top-menu />
    <v-main>
      <v-container>
        <nuxt />
        <snackbar />
      </v-container>
    </v-main>
    <the-footer />
  </v-app>
</template>

<script>
import TheFooter from '@/components/TheFooter';
import TopMenu from '~/components/TopMenu';
import Snackbar from '~/components/utils/Snackbar.vue';
export default {
  name: 'Default',
  components: {
    TopMenu,
    Snackbar,
    TheFooter,
  },
};
</script>
