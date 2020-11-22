<template>
  <v-dialog
    v-model="open"
    max-width="680px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :color="buttonColor"
        v-bind="attrs"
        v-on="on"
      >
        {{ buttonText }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="open = false">
          cancel
        </v-btn>
        <v-btn
          :color="buttonColor"
          @click="sendEvent"
        >
          {{ acceptText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    acceptText: {
      type: String,
      required: true,
    },
    buttonColor: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    sendEvent() {
      this.$emit('on-confirm');
      this.open = false;
    }
  },
};
</script>
