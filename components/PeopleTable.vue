<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card-title>
          Other players
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search By User name"
            single-line
            hide-details
            @keyup.enter="searchByName"
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :loading="loading"
          :items="otherUsers"
          :options.sync="optionz"
          :server-items-length="serverItemsLength"
        >
          <template #item.actions="{item}">
            <add-friend-dialog
              :username="item.username"
              @send-request="sendFriendRequest(item.id)"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AddFriendDialog from '@/components/AddFriendDialog';

export default {
  components: {
    AddFriendDialog
  },
  data() {
    return {
      loading: true,
      search: '',
      headers: [
        {
          value: 'username',
          text: 'User name'
        },
        {
          value: 'gamesPlayed',
          text: 'Games played',
        },
        {
          value: 'gamesWon',
          text: 'Games won'
        },
        {
          value: 'actions',
          text: 'Actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'users/options',
      serverItemsLength: 'users/serverItemsLength',
      otherUsers: 'users/otherUsers'
    }),
    optionz: {
      get() {
        return this.options;
      },
      set(opt) {
        this.updateOptions(opt);
        this.loading = true;
        this.getUsersFromServer().then(() => { this.loading = false; });
      }
    },
  },
  async created() {
    await this.getUsersFromServer();
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getUsersFromServer: 'users/getUsersFromServer',
      updateOptions: 'users/updateOptions',
      sendFriendRequestAction: 'users/sendFriendRequest',
      setSearchString: 'users/setSearchString',
    }),
    sendFriendRequest(id) {
      this.sendFriendRequestAction(id);
    },
    async searchByName() {
      this.loading = true;
      await this.setSearchString(this.search);
      await this.getUsersFromServer();
      this.loading = false;
    }
  },
};
</script>
