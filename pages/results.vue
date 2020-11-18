<template>
  <v-card>
    <v-card-title class="ml-5">
      Results
    </v-card-title>
    <div v-if="!gameEnded">
      <v-card-subtitle class="ml-5">
        Waiting for other players to finish
        <timer>
          <template v-slot:default="slotProps">
            Remaining time: {{ slotProps.min }}:{{ slotProps.sec }}
          </template>
        </timer>
      </v-card-subtitle>
    </div>

    <v-row justify="center">
      <v-col sm="10">
        <basic-mid-game-people-table v-if="!gameEnded" :players="players" />
        <final-results-table v-else :players="playersInFinalOrder" />
      </v-col>
    </v-row>
    {{ typeof(gameEnded) }}
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Timer from '@/components/Timer';
import BasicMidGamePeopleTable from '@/components/BasicMidGamePeopleTable';
import FinalResultsTable from '@/components/FinalResultsTable';

export default {
  components: {
    Timer,
    BasicMidGamePeopleTable,
    FinalResultsTable,
  },
  computed: {
    ...mapGetters({
      roomList: 'main/roomList',
      roomOwnerId: 'main/roomOwnerId',
      lastCodeRunResponse: 'main/codeRunResponse',
    }),
    room() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId);
    },
    gameEnded() {
      return this.room.gameEnded;
    },
    challenge() {
      return this.room.challenge;
    },
    players() {
      return [this.room.owner, ...this.room.others];
    },
    playersInFinalOrder() {
      if (!this.room.finalOrder) {
        return this.players;
      }

      const playersInOrder = [];
      this.room.finalOrder.forEach((id) => {
        playersInOrder.push(this.players.find(it => it.id === id));
      });

      return playersInOrder;
    },
  },
  beforeDestroy() {
    this.clearState();
  },
  methods: {
    ...mapActions({
      clearState: 'websocket/clearStateAfterGameEnded',
    }),
  },
};
</script>
