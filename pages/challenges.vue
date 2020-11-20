<template>
  <v-row justify="center">
    <v-col sm="10">
      <v-data-table
        :headers="headers"
        :loading="loading"
        :items="challenges"
        single-expand
        show-expand
        class="elevation-1"
        @update:sort-by="sortByChanged"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Challenges
            </v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <challenge-edit-modal>
              <template v-slot:default="slotProps">
                <v-btn
                  color="primary"
                  v-bind="slotProps.attrs"
                  v-on="slotProps.on"
                >
                  add new challenge
                </v-btn>
              </template>
            </challenge-edit-modal>
          </v-toolbar>
        </template>
        <template v-slot:expanded-item="{ item }">
          <td colspan="7" style="padding: 0 !important;">
            <v-data-table
              :headers="testHeaders"
              hide-default-footer
              class="elevation-6"
              dense
              :items="item.challengeTests"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  Test cases
                </v-toolbar>
              </template>
            </v-data-table>
          </td>
        </template>
        <template v-slot:item.testCount="{ item }">
          {{ item.challengeTests.length }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="openChallengeDeleteModal(item.id)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <delete-challenge-modal
      ref="deleteChallengeModal"
      @delete-challenge="deleteChallenge"
    />
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DeleteChallengeModal from '@/components/DeleteChallengeModal';
import ChallengeEditModal from '@/components/ChallengeEditModal';

export default {
  components: {
    DeleteChallengeModal,
    ChallengeEditModal,
  },
  data() {
    return {
      challengeIdToDelete: null,
      loading: true,
      pageRequest: {
        a: 'a'
      },
      headers: [
        {
          value: 'title',
          text: 'Title',
        },
        {
          value: 'description',
          text: 'Description',
        },
        {
          value: 'testCount',
          text: 'Test Count'
        },
        {
          value: 'actions',
          text: 'Actions',
          sortable: false
        }
      ],
      testHeaders: [
        {
          value: 'displayName',
          text: 'Display name',
        },
        {
          value: 'input',
          text: 'Input',
          sortable: false,
        },
        {
          value: 'expectedOutput',
          text: 'Expected Output',
          sortable: false,
        },
      ]
    };
  },
  computed: {
    ...mapGetters({
      challenges: 'challenges/challenges'
    }),
  },
  async mounted() {
    await this.getData();
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getData: 'challenges/getChallengesFromServer'
    }),
    editItem() {
      console.log('edit item');
    },
    openChallengeDeleteModal(id) {
      this.challengeIdToDelete = id;
      this.$refs.deleteChallengeModal.show();
    },
    deleteChallenge() {
      console.log('delete item');
    },
    sortByChanged(data) {
      console.log(data);
    },
  },
};
</script>
