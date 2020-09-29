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
            :key="item"
            text
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
            text
            @click="navigate(item)"
          >
            {{ item }}
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  data () {
    return {
      drawer: false,
      menu: {
        left: [
          'alma',
          'körte',
        ],
        right: [
          'login',
          'register'
        ]
      }
    };
  },
  computed: {
    userLoggedIn () {
      return this.$auth.loggedIn;
    }
  },
  methods: {
    navigate (item) {
      this.$router.push({ name: item });
    },
    visible (item) {
      switch (item) {
      case 'login':
      case 'register':
        return !this.userLoggedIn;
      }
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
