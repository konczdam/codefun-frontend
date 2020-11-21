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
        :options.sync="optionz"
        :server-items-length="serverItemsLength"
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
            />
            <v-spacer />
            <challenge-edit-modal ref="addNewChallengeModal" @save="saveChallenge">
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
          <challenge-edit-modal :challenge="item" @save="editItem()">
            <template v-slot:default="slotProps">
              <v-icon
                small
                class="mr-2"
                v-bind="slotProps.attrs"
                v-on="slotProps.on"
              >
                mdi-pencil
              </v-icon>
            </template>
          </challenge-edit-modal>
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
          text: 'Test Count',
          sortable: false,
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
      challenges: 'challenges/challenges',
      options: 'challenges/options',
      serverItemsLength: 'challenges/serverItemsLength',
    }),
    optionz: {
      get() {
        return this.options;
      },
      set(opt) {
        this.updateOptions(opt);
        this.loading = true;
        this.getData().then(() => { this.loading = false; });
      }
    }
  },
  async created() {
    await this.getData();
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getData: 'challenges/getChallengesFromServer',
      updateOptions: 'challenges/updateOptions',
      saveChallengeAction: 'challenges/saveChallenge',
      deleteChallengeAction: 'challenges/deleteChallenge',
    }),
    editItem() {
      console.log('edit item');
    },
    openChallengeDeleteModal(id) {
      this.challengeIdToDelete = id;
      this.$refs.deleteChallengeModal.show();
    },
    deleteChallenge() {
      const success = this.deleteChallengeAction(this.challengeIdToDelete);
      if (success) {
        this.$notifier.showMessage({
          content: 'Challenge successfully deleted!',
          color: 'success'
        });
        this.loading = true;
        setTimeout(async() => {
          await this.getData();
          this.loading = false;
          this.challengeIdToDelete = null;
        }, 500);
      } else {
        this.$notifier.showMessage({
          content: 'something went wrong deleting the challenge! Try again!',
          color: 'error'
        });
      }
    },
    async saveChallenge(challengeData) {
      const success = await this.saveChallengeAction(challengeData);
      if (success) {
        this.$notifier.showMessage({
          content: 'Challenge successfully created!',
          color: 'success'
        });
        this.$refs.addNewChallengeModal.clear();
      } else {
        this.$notifier.showMessage({
          content: 'something went wrong saving the challenge! Try again!',
          color: 'error'
        });
      }
      this.loading = true;
      await this.getData();
      this.loading = false;
    },
  },
};
</script>
