<template>
  <v-card>
    <v-row justify="center">
      <v-col sm="10">
        <v-data-table
          :key="JSON.stringify(roomList)"
          :headers="headers"
          :items.sync="roomList"
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
            <v-btn v-if="item.others.length < 7">
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

export default {
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
    ...mapGetters({ roomList: 'main/roomList' }),
  },
  mounted() {
    this.connect();
  },
  methods: {
    ...mapActions({ connect: 'websocket/connect' }),
  },
};
</script>

<style scoped>

</style>
