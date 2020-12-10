<template>
  <v-dialog
    v-model="open"
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        {{ $t('app.challenges.delete_challenge_modal.title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('app.challenges.delete_challenge_modal.text') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue lighten-3"
          @click="open = false"
        >
          {{ $t('general.cancel') }}
        </v-btn>
        <v-btn
          color="error"
          @click="sendConfirm"
        >
          {{ $t('general.yes') }}
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
