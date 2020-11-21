import { StatusCodes } from 'http-status-codes';

export const state = () => ({
  challenges: [],
  page: {
    page: 0,
    itemsPerPage: 5,
    sortBy: ['title'],
    sortDesc: [false],
    multiSort: false,
    mustSort: false,
  },
});

export const getters = {
  challenges: state => state.challenges
};

export const mutations = {
  setChallenges(state, newChallenges) {
    state.challenges = newChallenges;
  },
  setPage(state, newPage) {
    state.page = {
      pageSize: newPage.size,
      pageNumber: newPage.number,
      first: newPage.first,
      last: newPage.last,
      elements: newPage.numberOfElements,
      totalElements: newPage.totalElements,
      totalPages: newPage.totalPages
    };
  }
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
  async getChallengesFromServer({ commit }, pageRequest) {
    const response = await this.$axios.get('/challenges', {
      params: {
        page: 0,
        size: 5,
        sortProperty: 'title'
      },
    });
    if (response.status === StatusCodes.OK) {
      commit('setChallenges', response.data.content);
      console.log(response);
    } else {
      this.$notifier.showMessage({ content: 'there was an error fetching the data', color: 'error' });
    }
  },

  async saveChallenge({ commit }, challengeData) {
    const reponse = await this.$axios.post('/challenges', challengeData);
    return reponse.status === StatusCodes.CREATED;
  }
};
