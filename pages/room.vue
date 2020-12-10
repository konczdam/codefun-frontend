<template>
  <v-row justify="center">
    <v-col sm="7">
      <v-card class="elevation-10">
        <v-card-title style="margin-left: 12px">
          {{ $t('app.room.title') }}
          <v-spacer />
          <v-switch
            v-if="isOwner"
            label="Allow only friends"
            @change="sendFriendsOnlyUpdate"
          />
        </v-card-title>
        <room-owner-action-bar
          v-if="isOwner"
          :users="users"
          @game-type-set="sendGameTypeSet"
          @delete-room="deleteRoom"
          @start-game="startGame"
        />
        <room-guest-action-bar
          v-else
          :room="room"
          @leave-room="leaveRoom"
        />
        <v-card-subtitle style="margin-left: 12px" class="font-weight-bold">
          {{ $t('app.room.chat') }}
        </v-card-subtitle>
        <v-card-text>
          <div ref="chatContainer" class="chat-container">
            <message :messages="messages" />
          </div>
          <div class="typer">
            <input v-model="messageData" type="text" placeholder="Type here..." @keyup.enter="sendMessage">
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="3">
      <v-card class="mr-5 elevation-10">
        <v-card-title>
          {{ $t('app.room.people_in_the_room') }}
        </v-card-title>
        <v-list>
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Message from '@/components/Message';
import { isBlank } from '@/util';
import RoomOwnerActionBar from '@/components/RoomOwnerActionBar';
import RoomGuestActionBar from '@/components/RoomGuestActionBar';

export default {
  layout: 'navigation_drawer',
  components: {
    Message,
    RoomOwnerActionBar,
    RoomGuestActionBar,
  },
  data() {
    return {
      modes: ['Normal', 'Code Golf'],
      messageData: '',
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
      if (!this.room) {
        return [];
      }
      return [...this.room.others, this.room.owner];
    },
    messages() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId)?.messages || [];
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
      sendFriendsOnlyUpdate: 'websocket/sendFriendsOnlyUpdate',
    }),
    sendMessage() {
      if (isBlank(this.messageData)) {
        return;
      }
      this.sendMessageToRoom({
        message: {
          userId: this.$auth.user.id,
          username: this.$auth.user.username,
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
    },
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
