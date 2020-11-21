<template>
  <v-card-actions>
    <div class="ml-5">
      <p style="font-weight: bold">
        Choose game type
      </p>
      <v-btn-toggle
        v-model="selectedMode"
        mandatory
      >
        <v-tooltip
          v-for="mode in GAME_TYPES"
          :key="mode"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="black"
              outlined
              class="elevated-10"
              v-bind="attrs"
              v-on="on"
              @click="sendGameTypeSetEvent(mode)"
            >
              {{ startCase(mode) }}
            </v-btn>
          </template>
          <span> {{ $t('app.room.tooltip.' + mode) }} </span>
        </v-tooltip>
      </v-btn-toggle>
    </div>
    <v-spacer />
    <div class="mr-5">
      <p style="font-weight: bold">
        Close room
      </p>
      <v-dialog
        v-model="cancelDialogOpen"
        persistent
        max-width="600px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="error"
            dark
            v-bind="attrs"
            v-on="on"
          >
            close
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            Close room
          </v-card-title>
          <v-card-text>
            Do you really want to close to room?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="secondary"
              @click="cancelDialogOpen = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              @click="sendDeleteRoomEvent"
            >
              Delete Room
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-spacer />
    <div class="mr-5">
      <p style="font-weight: bold">
        Start game
      </p>
      <v-btn
        :disabled="users.length < 2"
        color="primary"
        @click="sendStartGameEvent"
      >
        Start
      </v-btn>
    </div>
  </v-card-actions>
</template>

<script>
import { GAME_TYPES } from '@/const';
import { startCase } from 'lodash';

export default {
  props: {
    users: {
      required: true,
      type: Array,
    }
  },
  data() {
    return {
      GAME_TYPES,
      selectedMode: '',
      cancelDialogOpen: false,
    };
  },
  methods: {
    startCase,
    sendGameTypeSetEvent(mode) {
      this.$emit('game-type-set', mode);
    },
    sendDeleteRoomEvent() {
      this.$emit('delete-room');
    },
    sendStartGameEvent() {
      this.$emit('start-game');
    }
  },
};
</script>
