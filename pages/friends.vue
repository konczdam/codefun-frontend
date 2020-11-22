<template>
  <v-card elevation="10">
    <v-tabs>
      <v-tab>
        Friends
      </v-tab>
      <v-tab>
        Incoming friend requests
      </v-tab>
      <v-tab>
        Outgoing friend requests
      </v-tab>
      <v-tab>
        Find friends
      </v-tab>
      <v-tab-item>
        a
      </v-tab-item>
      <v-tab-item>
        b
      </v-tab-item>
      <v-tab-item>
        c
      </v-tab-item>
      <v-tab-item>
        <people-table
          title="Other players"
          @get-data="getNonFriendsUsersFromServer"
        >
          <template v-slot:actions="{ user }">
            <add-friend-dialog
              :username="user.username"
              @send-request="sendFriendRequest(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import PeopleTable from '@/components/PeopleTable';
import AddFriendDialog from '@/components/AddFriendDialog';
import { mapActions } from 'vuex';

export default {
  components: {
    PeopleTable,
    AddFriendDialog,
  },
  methods: {
    ...mapActions({
      getNonFriendUsersFromServerAction: 'users/getNonFriendUsersFromServer',
      sendFriendRequestAction: 'users/sendFriendRequest',
    }),
    async getNonFriendsUsersFromServer() {
      await this.getNonFriendUsersFromServerAction();
    },
    sendFriendRequest(id) {
      this.sendFriendRequestAction(id);
    },
  }
};
</script>
