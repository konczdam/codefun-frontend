<template>
  <v-card elevation="10">
    <v-tabs @change="handleTabChange">
      <v-tab
        v-for="tab in tabs"
        :key="tab"
      >
        {{ $t('app.friends.tabs.' + tab + '.text') }}
      </v-tab>

      <!--Friends-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 0"
          :title="$t('app.friends.tabs.' + tabs[0] + '.title')"
          :headers="peopleTableHeaders"
          @get-data="getFriendsFromServer"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              :button-text="$t('app.friends.dialogs.remove_friend.button_text')"
              :title="$t('app.friends.dialogs.remove_friend.title')"
              :text="$t('app.friends.dialogs.remove_friend.text')"
              button-color="error"
              :accept-text="$t('general.yes')"
              @on-confirm="removeFriend(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>

      <!--Awaiting incoming friend requests-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 1"
          :title="$t('app.friends.tabs.' + tabs[1] + '.title')"
          :headers="peopleTableHeaders"
          @get-data="getPageOfUsersWhoSentFriendRequests"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              :button-text="$t('app.friends.dialogs.reject_request.button_text')"
              :title="$t('app.friends.dialogs.reject_request.title')"
              :text="$t('app.friends.dialogs.reject_request.text')"
              :accept-text="$t('general.yes')"
              button-color="error"
              @on-confirm="rejectFriendRequest(user.id)"
            />
            <generic-dialog
              :button-text="$t('app.friends.dialogs.accept_request.button_text')"
              :title="$t('app.friends.dialogs.accept_request.title')"
              :text="$t('app.friends.dialogs.accept_request.text')"
              :accept-text="$t('general.yes')"
              button-color="primary"
              @on-confirm="acceptFriendRequest(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>

      <!--Awaiting outgoing friend requests-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 2"
          :title="$t('app.friends.tabs.' + tabs[2] + '.title')"
          :headers="peopleTableHeaders"
          @get-data="getUsersFriendRequestSentTo"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              :button-text="$t('app.friends.dialogs.cancel_request.button_text')"
              :title="$t('app.friends.dialogs.cancel_request.title')"
              :text="$t('app.friends.dialogs.cancel_request.text')"
              :accept-text="$t('general.yes')"
              @on-confirm="cancelFriendRequest(user.id)"
            />
          </template>
        </people-table>
      </v-tab-item>

      <!--Non friends-->
      <v-tab-item>
        <people-table
          v-if="activeTab === 3"
          :title="$t('app.friends.tabs.' + tabs[3] + '.title')"
          :headers="peopleTableHeaders"
          @get-data="getNonFriendsUsersFromServer"
        >
          <template v-slot:actions="{ user }">
            <generic-dialog
              :button-text="$t('app.friends.dialogs.create_request.button_text')"
              :title="$t('app.friends.dialogs.create_request.title')"
              :text="$t('app.friends.dialogs.create_request.text', { username: user.user })"
              :accept-text="$t('app.friends.dialogs.create_request.accept_text')"
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
        'incoming_friend_requests',
        'outgoing_friend_requests',
        'find_friends',
      ],
      peopleTableHeaders: [
        {
          value: 'username',
          text: this.$t('app.friends.people_table.headers.username')
        },
        {
          value: 'gamesPlayed',
          text: this.$t('app.friends.people_table.headers.games_played'),
        },
        {
          value: 'gamesWon',
          text: this.$t('app.friends.people_table.headers.games_won')
        },
        {
          value: 'actions',
          text: this.$t('general.actions'),
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
