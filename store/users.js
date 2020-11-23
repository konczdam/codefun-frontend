import { StatusCodes } from 'http-status-codes';

export const state = () => ({
  userData: {},
  options: {
    page: 1,
    itemsPerPage: 5,
    sortBy: ['username'],
    sortDesc: [false],
    multiSort: false,
    mustSort: false,
  },
  serverItemsLength: 0,
  otherUsers: [],
  searchString: null,
  friendIds: [],
});

export const getters = {
  userData: state => state.userData,
  options: state => state.options,
  serverItemsLength: state => state.serverItemsLength,
  otherUsers: state => state.otherUsers,
  searchString: state => state.searchString,
  friendIds: state => state.friendIds,
};

export const mutations = {
  setUserData(state, newUserData) {
    state.userData = newUserData;
  },
  setOptions(state, options) {
    state.options = {
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy,
      sortDesc: options.sortDesc,
      multiSort: false,
      mustSort: true,
    };
  },
  setServerItemsLength(state, newLength) {
    state.serverItemsLength = newLength;
  },
  setOtherUsers(state, users) {
    state.otherUsers = users;
  },
  setSearchString(state, searchString) {
    state.searchString = searchString;
  },
  setFriendIds(state, friendIds) {
    state.friendIds = friendIds;
  },
};

export const actions = {
  async getAllFriendIds({ commit }) {
    const reponse = await this.$axios.get('/users/friend-ids');
    commit('setFriendIds', reponse.data);
  },
  clearState({ commit }) {
    commit('setOptions', {
      page: 1,
      itemsPerPage: 5,
      sortBy: ['username'],
      sortDesc: [false],
      multiSort: false,
      mustSort: false,
    });
    commit('setSearchString', null);
    commit('setServerItemsLength', 0);
  },
  async getUserDataFromServer({ commit }) {
    const id = this.$auth.user.id;
    const response = await this.$axios.get(`/users/${id}`);
    if (response.status === StatusCodes.OK) {
      commit('setUserData', response.data);
    } else {
      this.$notifier.showMessage({
        content: 'Failed to fetch user data from server!',
        color: 'error',
      });
    }
  },
  async changePassword({ commit }, passwordChangeData) {
    try {
      const response = await this.$axios.post('/users/changePassword', passwordChangeData);
      if (response.status === StatusCodes.OK) {
        this.$notifier.showMessage({
          content: 'Password successfully changed',
          color: 'success',
        });
        return true;
      } else {
        this.$notifier.showMessage({
          content: response.status,
          color: 'error',
        });
      }
    } catch (e) {
      this.$notifier.showMessage({
        content: 'The provided current password is incorrect.',
        color: 'error',
      });
    }
    return false;
  },

  async getNonFriendUsersFromServer({ commit, getters }) {
    const response = await this.$axios.get('/users/not-friends', {
      params: {
        page: getters.options.page - 1,
        size: getters.options.itemsPerPage,
        sortProperty: getters.options.sortBy[0],
        sortDirection: getters.options.sortDesc[0] ? 'desc' : 'asc',
        name: getters.searchString ?? null
      },
    });
    if (response.status === StatusCodes.OK) {
      commit('setOtherUsers', response.data.content);
      commit('setServerItemsLength', response.data.totalElements);
    } else {
      this.$notifier.showMessage({ content: 'there was an error fetching the data', color: 'error' });
    }
  },

  async getUsersFriendRequestSentTo({ commit, getters }) {
    const response = await this.$axios.get('/users/friend-requests-sent-to', {
      params: {
        page: getters.options.page - 1,
        size: getters.options.itemsPerPage,
        sortProperty: getters.options.sortBy[0],
        sortDirection: getters.options.sortDesc[0] ? 'desc' : 'asc',
        name: getters.searchString ?? null
      },
    });
    if (response.status === StatusCodes.OK) {
      commit('setOtherUsers', response.data.content);
      commit('setServerItemsLength', response.data.totalElements);
    } else {
      this.$notifier.showMessage({ content: 'there was an error fetching the data', color: 'error' });
    }
  },

  updateOptions({ commit }, newOptions) {
    if (!newOptions) {
      return;
    }
    commit('setOptions', newOptions);
  },

  async sendFriendRequest({ commit }, receiverId) {
    const requestData = {
      requesterId: this.$auth.user.id,
      receiverId,
    };
    const response = await this.$axios.post('/friendship/addRequest', requestData);
    if (response.status === StatusCodes.OK) {
      console.log('yay');
    } else {
      console.log('error');
    }
  },

  async cancelFriendRequest({ commit }, receiverId) {
    const requestData = {
      requesterId: this.$auth.user.id,
      receiverId,
    };
    const response = await this.$axios.post('/friendship/rejectRequest', requestData);
    if (response.status === StatusCodes.OK) {
      console.log('yay');
    } else {
      console.log('error');
    }
  },

  async getPageOfUsersWhoSentFriendRequests({ commit, getters }) {
    const response = await this.$axios.get('/users/incoming-friend-requests', {
      params: {
        page: getters.options.page - 1,
        size: getters.options.itemsPerPage,
        sortProperty: getters.options.sortBy[0],
        sortDirection: getters.options.sortDesc[0] ? 'desc' : 'asc',
        name: getters.searchString ?? null
      },
    });
    if (response.status === StatusCodes.OK) {
      commit('setOtherUsers', response.data.content);
      commit('setServerItemsLength', response.data.totalElements);
    } else {
      this.$notifier.showMessage({ content: 'there was an error fetching the data', color: 'error' });
    }
  },

  async rejectFriendRequest({ commit }, requesterId) {
    const requestData = {
      receiverId: this.$auth.user.id,
      requesterId,
    };
    console.log({ requestData });
    const response = await this.$axios.post('/friendship/cancelRequest', requestData);
    if (response.status === StatusCodes.OK) {
      console.log('yay');
    } else {
      console.log('error');
    }
  },

  async acceptFriendRequest({ commit }, requesterId) {
    const requestData = {
      receiverId: this.$auth.user.id,
      requesterId,
    };
    const response = await this.$axios.post('/friendship/acceptRequest', requestData);
    if (response.status === StatusCodes.OK) {
      console.log('yay');
    } else {
      console.log('error');
    }
  },

  async getFriendsFromServer({ commit, getters }) {
    const response = await this.$axios.get('/users/friends', {
      params: {
        page: getters.options.page - 1,
        size: getters.options.itemsPerPage,
        sortProperty: getters.options.sortBy[0],
        sortDirection: getters.options.sortDesc[0] ? 'desc' : 'asc',
        name: getters.searchString ?? null
      },
    });
    if (response.status === StatusCodes.OK) {
      commit('setOtherUsers', response.data.content);
      commit('setServerItemsLength', response.data.totalElements);
    } else {
      this.$notifier.showMessage({ content: 'there was an error fetching the data', color: 'error' });
    }
  },

  async removeFriend({ commit }, requesterId) {
    const requestData = {
      receiverId: this.$auth.user.id,
      requesterId,
    };
    const response = await this.$axios.post('/friendship/removeFriend', requestData);
    if (response.status === StatusCodes.OK) {
      console.log('yay');
    } else {
      console.log('error');
    }
  },

  setSearchString({ commit }, newString) {
    commit('setSearchString', newString);
  }
};
