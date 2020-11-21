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
              Rooms
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
                  Create room
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
          <v-btn
            v-if="item.others.length < 7"
            color="secondary"
            @click="joinRoom(item.owner.id)"
          >
            Join
          </v-btn>
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
          text: 'Owner',
          value: 'owner',
          sortable: false,
        },
        {
          text: 'Description',
          value: 'description',
          sortable: false,
        },
        {
          text: 'Participants',
          value: 'participants',
        },
        {
          text: 'Actions',
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
    }),
    filteredRoomList() {
      return this.roomList.filter(room => !room.gameStarted);
    },
  },
  mounted() {
    this.connect();
  },
  methods: {
    ...mapActions({
      connect: 'websocket/connect',
      createRoomAction: 'websocket/createRoom',
      joinRoomAction: 'websocket/joinRoom',
      subscribeToRoomMessages: 'websocket/subscribeToRoomMessages',
      subscribeToRoomGameTypeSet: 'websocket/subscribeToRoomGameTypeSet',
      subscribeToGameStarted: 'websocket/subscribeToGameStarted',
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
