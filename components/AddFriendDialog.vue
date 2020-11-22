<template>
  <v-dialog
    v-model="open"
    max-width="680px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="secondary"
        v-bind="attrs"
        v-on="on"
      >
        Add friend
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Send friend request
      </v-card-title>
      <v-card-text>
        {{ username }} will receive a friend request.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="open = false">
          cancel
        </v-btn>
        <v-btn
          color="secondary"
          @click="sendEvent"
        >
          send request
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    sendEvent() {
      this.$emit('send-request');
      this.open = false;
    }
  },
};
</script>
