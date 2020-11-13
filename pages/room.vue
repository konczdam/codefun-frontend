<template>
  <v-card>
    <v-card-title class="ml-5">
      Room
    </v-card-title>
    <v-row justify="center">
      <v-col v-if="isOwner" sm="6">
        <v-form>
          <p style="font-weight: bold">
            Choose game type
          </p>
          <v-btn-toggle
            v-model="mode"
            mandatory
          >
            <v-tooltip
              v-for="mode in GAME_TYPES"
              :key="mode"
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="sendGameTypeSet(mode)"
                >
                  {{ startCase(mode) }}
                </v-btn>
              </template>
              <span> {{ $t('app.room.tooltip.' + mode) }} </span>
            </v-tooltip>
          </v-btn-toggle>
        </v-form>
      </v-col>
      <template v-else>
        <v-col sm="5">
          <p style="font-weight: bold">
            Selected Game Style
          </p>
          <v-tooltip right>
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
        </v-col>
        <v-col sm="5">
          <p style="opacity: 0">
            aa
          </p>
          <v-btn
            color="warning"
            @click="leaveRoom"
          >
            Leave room
          </v-btn>
        </v-col>
      </template>
      <v-col v-if="isOwner" sm="2">
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
                @click="deleteRoom"
              >
                Delete Room
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col v-if="isOwner" sm="2">
        <p style="font-weight: bold">
          Start game
        </p>
        <v-btn
          :disabled="users.length < 2"
          color="primary"
          @click="startGame"
        >
          Start
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col sm="7" offset="1">
        <v-card>
          <v-card-title>
            Chat
          </v-card-title>
          <div ref="chatContainer" class="chat-container">
            <message :messages="messages" />
          </div>
          <div class="typer">
            <input v-model="messageData" type="text" placeholder="Typeí here..." @keyup.enter="sendMessage">
          </div>
        </v-card>
      </v-col>
      <v-col offset="1" sm="3">
        <v-card class="mr-5">
          <v-list subheader>
            <v-subheader>
              People in the room
            </v-subheader>
            <v-list-item
              v-for="user in users"
              :key="user.id"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-account</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Message from '@/components/Message';
import { GAME_TYPES } from '@/const';
import { startCase } from 'lodash';

export default {
  layout: 'navigation_drawer',
  components: {
    Message,
  },
  data() {
    return {
      mode: '',
      modes: ['Normal', 'Code Golf'],
      messageData: '',
      cancelDialogOpen: false,
      GAME_TYPES,
    };
  },
  computed: {
    ...mapGetters({
      roomList: 'main/roomList',
      roomOwnerId: 'main/roomOwnerId',
    }),
    room() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId);
    },
    users() {
      const result = [];
      result.push(this.room.owner);
      Array.prototype.push.apply(result, this.room.others);
      return result;
    },
    messages() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId).messages || [];
    },
    isOwner() {
      return this.$auth.$storage.getUniversal('user').id === this.roomOwnerId;
    },
  },
  methods: {
    ...mapActions({
      sendMessageToRoom: 'websocket/sendMessageToRoom',
      sendDeleteRoom: 'websocket/sendDeleteRoom',
      sendGameTypeSetAction: 'websocket/sendGameTypeSet',
      leaveRoomAction: 'websocket/sendLeaveRoom',
      startGameAction: 'websocket/sendStartGame',
    }),
    startCase,
    sendMessage() {
      this.sendMessageToRoom({
        message: {
          userId: this.$auth.$storage.getUniversal('user').id,
          username: this.$auth.$storage.getUniversal('user').username,
          message: this.messageData,
        },
        roomId: this.roomOwnerId
      });
      this.messageData = '';
    },
    deleteRoom() {
      this.sendDeleteRoom(this.roomOwnerId);
      this.$router.push({ name: 'compete' });
    },
    sendGameTypeSet(newGameType) {
      this.sendGameTypeSetAction(newGameType);
    },
    leaveRoom() {
      this.leaveRoomAction(this.roomOwnerId);
      this.$router.push({ name: 'compete' });
    },
    startGame() {
      this.startGameAction();
    }
  },
};
</script>

<style lang="scss">
  .chat-container {
    box-sizing: border-box;
    height: calc(60vh - 9.5rem);
    overflow-y: auto;
    padding: 10px;
    background-color: #f2f2f2;

  }

  .typer {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    bottom: 0;
    height: 4.9rem;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);

    input[type=text] {
      position: absolute;
      padding: 1rem;
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      font-size: 1.25rem;
    }
  }
</style>
