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
});

export const getters = {
  userData: state => state.userData,
  options: state => state.options,
  serverItemsLength: state => state.serverItemsLength,
  otherUsers: state => state.otherUsers,
  searchString: state => state.searchString,
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
};

export const actions = {
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

  async getUsersFromServer({ commit, getters }) {
    const response = await this.$axios.get('/users', {
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
  setSearchString({ commit }, newString) {
    commit('setSearchString', newString);
  }
};
