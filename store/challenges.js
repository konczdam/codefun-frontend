import { StatusCodes } from 'http-status-codes';

export const state = () => ({
  challenges: [],
  options: {
    page: 1,
    itemsPerPage: 5,
    sortBy: ['title'],
    sortDesc: [false],
    multiSort: false,
    mustSort: false,
  },
  serverItemsLength: 0,
});

export const getters = {
  challenges: state => state.challenges,
  options: state => state.options,
  serverItemsLength: state => state.serverItemsLength,
};

export const mutations = {
  setChallenges(state, newChallenges) {
    state.challenges = newChallenges;
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
};
// page = {
//   pageSize: body.size,
//   pageNumber: body.number,
//   first: body.first,
//   last: body.last,
//   elements: body.numberOfElements,
//   totalElements: body.totalElements,
//   totalPages: body.totalPages
// };
export const actions = {
  async getChallengesFromServer({ commit, getters }) {
    const response = await this.$axios.get('/challenges', {
      params: {
        page: getters.options.page - 1,
        size: getters.options.itemsPerPage,
        sortProperty: getters.options.sortBy[0],
        sortDirection: getters.options.sortDesc[0] ? 'desc' : 'asc',
      },
    });
    if (response.status === StatusCodes.OK) {
      commit('setChallenges', response.data.content);
      commit('setServerItemsLength', response.data.totalElements);
    } else {
      this.$notifier.showMessage({ content: 'there was an error fetching the data', color: 'error' });
    }
  },

  async saveChallenge({ commit }, challengeData) {
    const response = await this.$axios.post('/challenges', challengeData);
    return response.status === StatusCodes.CREATED;
  },

  updateOptions({ commit }, newOptions) {
    if (!newOptions) {
      return;
    }
    commit('setOptions', newOptions);
  },

  async deleteChallenge({ commit }, id) {
    const response = await this.$axios.delete(`/challenges/${id}`);
    return response.status === StatusCodes.OK;
  },
};
