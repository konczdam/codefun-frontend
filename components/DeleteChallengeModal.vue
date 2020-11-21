<template>
  <v-dialog
    v-model="open"
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        Delete Challenge
      </v-card-title>
      <v-card-text>
        Dou you really wanna delete this challenge?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue lighten-3"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          @click="sendConfirm"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
  methods: {
    sendConfirm() {
      this.$emit('delete-challenge');
      this.open = false;
    },
    show() {
      this.open = true;
    },
  },
};
</script>
