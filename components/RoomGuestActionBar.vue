<template>
  <v-card-actions>
    <div class="ml-5">
      <p style="font-weight: bold">
        Selected Game Style
      </p>
      <v-tooltip v-if="room" right>
        <template v-slot:activator="{ on, attrs }">
          <v-chip
            v-bind="attrs"
            label
            v-on="on"
          >
            {{ startCase(room.gameType) }}
          </v-chip>
        </template>
        <span> {{ $t('app.room.tooltip.' + room.gameType) }} </span>
      </v-tooltip>
    </div>
    <v-spacer />
    <div class="mr-5">
      <p style="font-weight: bold">
        Leave room
      </p>
      <v-btn
        color="warning"
        @click="sendLeaveRoomEvent"
      >
        Leave room
      </v-btn>
    </div>
  </v-card-actions>
</template>

<script>
import { startCase } from 'lodash';

export default {
  props: {
    room: {
      type: Object,
      required: true,
    },
  },
  methods: {
    startCase,
    sendLeaveRoomEvent() {
      this.$emit('leave-room');
    },
  },
};
</script>
