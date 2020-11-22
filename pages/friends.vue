<template>
  <v-card elevation="10">
    <v-tabs @change="handleTabChange">
      <v-tab
        v-for="tab in tabs"
        :key="tab"
      >
        {{ tab }}
      </v-tab>

      <!--Friends-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 0"
          title="Friends"
          :headers="peopleTableHeaders"
          @get-data="getFriendsFromServer"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              button-text="remove friend"
              title="Remove user from friend list"
              text="Are you sure wanna remove the user from your friend list?"
              button-color="error"
              accept-text="yes"
              @on-confirm="removeFriend(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>

      <!--Awaiting incoming friend requests-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 1"
          title="Friend requests awaiting for approval"
          :headers="peopleTableHeaders"
          @get-data="getPageOfUsersWhoSentFriendRequests"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              button-text="Reject"
              title="Reject friend request"
              text="Are you sure want to reject the friend request?"
              accept-text="Yes"
              button-color="error"
              @on-confirm="rejectFriendRequest(user.id)"
            />
            <generic-dialog
              button-text="accept"
              title="Accept friend request"
              button-color="primary"
              text="Are you sure want to accept the friend request?"
              accept-text="yes"
              @on-confirm="acceptFriendRequest(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>

      <!--Awaiting outgoing friend requests-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 2"
          title="Players that you sent friend request"
          :headers="peopleTableHeaders"
          @get-data="getUsersFriendRequestSentTo"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              button-text="Cancel friend request"
              title="Send friend request"
              text="Are you sure want to cancel your friend request?"
              accept-text="Yes"
              @on-confirm="cancelFriendRequest(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>

      <!--Non friends-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 3"
          title="Other players"
          :headers="peopleTableHeaders"
          @get-data="getNonFriendsUsersFromServer"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              button-text="Add friend"
              title="Send friend request"
              :text="`${user.username} will receive a friend request.`"
              accept-text="send request"
              @on-confirm="sendFriendRequest(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import PeopleTable from '@/components/PeopleTable';
import GenericDialog from '@/components/GenericDialog';
import { mapActions } from 'vuex';

export default {
  components: {
    PeopleTable,
    GenericDialog,
  },
  data() {
    return {
      activeTab: 0,
      tabs: [
        'friends',
        'Incoming friend requests',
        'Outgoing friend requests',
        'Find friends',
      ],
      peopleTableHeaders: [
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
  methods: {
    ...mapActions({
      clearState: 'users/clearState',
      getNonFriendUsersFromServerAction: 'users/getNonFriendUsersFromServer',
      sendFriendRequestAction: 'users/sendFriendRequest',
      getUsersFriendRequestSentToAction: 'users/getUsersFriendRequestSentTo',
      cancelFriendRequestAction: 'users/cancelFriendRequest',
      getPageOfUsersWhoSentFriendRequestsAction: 'users/getPageOfUsersWhoSentFriendRequests',
      rejectFriendRequestAction: 'users/rejectFriendRequest',
      acceptFriendRequestAction: 'users/acceptFriendRequest',
      getFriendsFromServerAction: 'users/getFriendsFromServer',
      removeFriendAction: 'users/removeFriend',
    }),
    async handleTabChange(tabIdx) {
      this.clearState();
      this.activeTab = tabIdx;
      switch (tabIdx) {
      case 0:
        await this.getFriendsFromServer();
        break;
      case 1:
        await this.getPageOfUsersWhoSentFriendRequests();
        break;
      case 2:
        await this.getUsersFriendRequestSentTo();
        break;
      case 3:
        await this.getNonFriendsUsersFromServer();
        break;
      }
    },
    async getNonFriendsUsersFromServer() {
      await this.getNonFriendUsersFromServerAction();
    },
    async sendFriendRequest(id) {
      await this.sendFriendRequestAction(id);
      await this.getNonFriendUsersFromServerAction();
    },
    async getUsersFriendRequestSentTo() {
      await this.getUsersFriendRequestSentToAction();
    },
    async cancelFriendRequest(id) {
      await this.cancelFriendRequestAction(id);
      await this.getUsersFriendRequestSentToAction();
    },
    async getPageOfUsersWhoSentFriendRequests() {
      await this.getPageOfUsersWhoSentFriendRequestsAction();
    },
    async rejectFriendRequest(id) {
      await this.rejectFriendRequestAction(id);
      await this.getPageOfUsersWhoSentFriendRequests();
    },
    async acceptFriendRequest(id) {
      await this.acceptFriendRequestAction(id);
      await this.getPageOfUsersWhoSentFriendRequests();
    },
    async getFriendsFromServer() {
      await this.getFriendsFromServerAction();
    },
    async removeFriend(id) {
      await this.removeFriendAction(id);
      await this.getFriendsFromServer();
    },
  }
};
</script>
