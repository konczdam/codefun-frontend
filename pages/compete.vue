<template>
  <v-card>
    <v-card-title>
      Rooms
    </v-card-title>
    <v-row justify="center">
      <v-col sm="10">
        <v-dialog
          v-model="roomOpenModalOpen"
          persistent
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs}">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Create room
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline"> Create room</span>
            </v-card-title>
            <v-card-text>
              <ValidationObserver ref="observer">
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="12"
                    >
                      <ValidationProvider
                        v-slot="{errors}"
                        name="Description"
                        rules="max:40"
                      >
                        <v-text-field
                          v-model="description"
                          label="Description"
                          hint="Add a short description to your room"
                          :error-messages="errors"
                          type="text"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-container>
              </ValidationObserver>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="warning"
                @click="roomOpenModalOpen = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="createRoom"
              >
                Create Room
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col sm="10">
        <v-data-table
          :key="JSON.stringify(roomList)"
          :headers="headers"
          :items.sync="filteredRoomList"
          class="elevation-1"
          hide-default-footer
        >
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
            <v-btn v-if="item.others.length < 7" @click="joinRoom(item.owner.id)">
              Join
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      roomOpenModalOpen: false,
      description: '',
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
      subscribeToRoomDeleted: 'websocket/subscribeToRoomClosed',
      subscribeToRoomGameTypeSet: 'websocket/subscribeToRoomGameTypeSet',
      subscribeToGameStarted: 'websocket/subscribeToGameStarted',
    }),
    async createRoom() {
      // eslint-disable-next-line no-unused-vars
      const descriptionValid = await this.$refs.observer.validate();
      if (!descriptionValid) {
        return;
      }

      this.createRoomAction(this.description);
      this.subscribeToRoomMessages(this.roomOwnerId);
      this.subscribeToRoomDeleted(this.roomOwnerId);
      this.subscribeToGameStarted(this.roomOwnerId);
    },
    joinRoom(roomId) {
      this.joinRoomAction(roomId);
      this.subscribeToRoomMessages(roomId);
      this.subscribeToRoomDeleted(roomId);
      this.subscribeToRoomGameTypeSet(roomId);
      this.subscribeToGameStarted(roomId);
      this.$router.push({ name: 'room' });
    },
  },
};
</script>

<style scoped>

</style>
