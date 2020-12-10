<template>
  <v-row justify="space-around">
    <v-col sm="5">
      <v-card elevation="0" outlined>
        <v-card-title :class="{ innerCard: inner }">
          {{ $t('app.challenges.modal.form.input') }}
        </v-card-title>
        <v-card-text>
          {{ challengeTest.input }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="5">
      <v-card elevation="0" outlined>
        <v-card-title :class="{ innerCard: inner }">
          {{ $t('app.challenges.modal.form.expected_output') }}
        </v-card-title>
        <v-card-text>
          {{ challengeTest.expectedOutput }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    challengeTest: {
      required: true,
      type: Object,
    },
    inner: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style scoped>
  .innerCard {
    font-size: 15px !important;
    padding: 10px 10px 10px 16px;
  }
</style>
