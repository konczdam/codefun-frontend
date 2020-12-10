<template>
  <v-row justify="center">
    <v-col sm="10">
      <v-data-table
        :key="JSON.stringify(roomList)"
        :headers="headers"
        :items.sync="filteredRoomList"
        class="elevation-10"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              {{ $t('app.compete.title') }}
            </v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-spacer />
            <create-room-modal @create-room="createRoom">
              <template v-slot:default="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ $t('app.compete.create_room') }}
                </v-btn>
              </template>
            </create-room-modal>
          </v-toolbar>
        </template>

        <template #item.owner="{item}">
          {{ item.owner.username }}
        </template>

        <template #item.description="{item}">
          {{ item.description }}
        </template>

        <template #item.participants="{item}">
          {{ item.others.length + 1 }} /8
        </template>

        <template #item.actions="{item}">
          <v-tooltip
            :disabled="!(item.friendsOnly && !friendIds.includes(item.owner.id))"
            bottom
          >
            <template v-slot:activator="{ on }">
              <div class="d-inline-block" v-on="on">
                <v-btn
                  v-if="item.others.length < 7"
                  :disabled="item.friendsOnly && !friendIds.includes(item.owner.id)"
                  color="secondary"
                  @click="joinRoom(item.owner.id)"
                >
                  {{ $t('app.compete.join') }}
                </v-btn>
              </div>
            </template>
            <span>
              {{ $t('app.compete.onlyFriends') }}
            </span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateRoomModal from '@/components/CreateRoomModal';

export default {
  components: {
    CreateRoomModal,
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('app.compete.room_table.headers.owner'),
          value: 'owner',
          sortable: false,
        },
        {
          text: this.$t('app.compete.room_table.headers.description'),
          value: 'description',
          sortable: false,
        },
        {
          text: this.$t('app.compete.room_table.headers.participants'),
          value: 'participants',
        },
        {
          text: this.$t('general.actions'),
          value: 'actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      roomList: 'main/roomList',
      roomOwnerId: 'main/roomOwnerId',
      friendIds: 'users/friendIds',
    }),
    filteredRoomList() {
      return this.roomList.filter(room => !room.gameStarted);
    },
  },
  async mounted() {
    this.connect();
    await this.getAllFriendIds();
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'main/updateRoomFriendsOnly') {
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    });
  },
  methods: {
    ...mapActions({
      connect: 'websocket/connect',
      createRoomAction: 'websocket/createRoom',
      joinRoomAction: 'websocket/joinRoom',
      subscribeToRoomMessages: 'websocket/subscribeToRoomMessages',
      subscribeToRoomGameTypeSet: 'websocket/subscribeToRoomGameTypeSet',
      subscribeToGameStarted: 'websocket/subscribeToGameStarted',
      getAllFriendIds: 'users/getAllFriendIds',
    }),
    createRoom(description) {
      this.createRoomAction(description);
      this.subscribeToRoomMessages(this.roomOwnerId);
      this.subscribeToGameStarted(this.roomOwnerId);
    },
    joinRoom(roomId) {
      this.joinRoomAction(roomId);
      this.subscribeToRoomMessages(roomId);
      this.subscribeToRoomGameTypeSet(roomId);
      this.subscribeToGameStarted(roomId);
      this.$router.push({ name: 'room' });
    },
  },
};
</script>
