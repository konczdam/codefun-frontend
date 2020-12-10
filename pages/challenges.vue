<template>
  <v-row justify="center">
    <v-col sm="10">
      <v-data-table
        :headers="headers"
        :loading="loading"
        :items="challenges"
        single-expand
        show-expand
        class="elevation-10"
        :options.sync="optionz"
        :server-items-length="serverItemsLength"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              {{ $t('app.challenges.title') }}
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
                  {{ $t('app.challenges.add_new_challenge') }}
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
                  {{ $t('app.challenges.test_cases') }}
                </v-toolbar>
              </template>
            </v-data-table>
          </td>
        </template>
        <template v-slot:item.testCount="{ item }">
          {{ item.challengeTests.length }}
        </template>
        <template v-slot:item.actions="{ item }">
          <challenge-edit-modal :challenge="item" @save="editItem">
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
          text: this.$t('app.challenges.main_table.headers.title'),
        },
        {
          value: 'description',
          text: this.$t('app.challenges.main_table.headers.description'),
        },
        {
          value: 'testCount',
          text: this.$t('app.challenges.main_table.headers.test_count'),
          sortable: false,
        },
        {
          value: 'actions',
          text: this.$t('general.actions'),
          sortable: false
        }
      ],
      testHeaders: [
        {
          value: 'displayName',
          text: this.$t('app.challenges.test_table.headers.display_name'),
        },
        {
          value: 'input',
          text: this.$t('app.challenges.test_table.headers.input'),
          sortable: false,
        },
        {
          value: 'expectedOutput',
          text: this.$t('app.challenges.test_table.headers.expected_output'),
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
    },
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
      updateChallengeAction: 'challenges/updateChallenge',
    }),
    editItem(challengeData) {
      const success = this.updateChallengeAction(challengeData);
      if (success) {
        this.$notifier.showMessage({
          content: this.$t('app.challenges.success_update'),
          color: 'success'
        });
        this.loading = true;
        setTimeout(async() => {
          await this.getData();
          this.loading = false;
        }, 500);
      } else {
        this.$notifier.showMessage({
          content: this.$t('app.challenges.error_update'),
          color: 'error'
        });
      }
    },
    openChallengeDeleteModal(id) {
      this.challengeIdToDelete = id;
      this.$refs.deleteChallengeModal.show();
    },
    deleteChallenge() {
      const success = this.deleteChallengeAction(this.challengeIdToDelete);
      if (success) {
        this.$notifier.showMessage({
          content: this.$t('app.challenges.success_delete'),
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
          content: this.$t('app.challenges.error_delete'),
          color: 'error'
        });
      }
    },
    async saveChallenge(challengeData) {
      const success = await this.saveChallengeAction(challengeData);
      if (success) {
        this.$notifier.showMessage({
          content: this.$t('app.challenges.success_create'),
          color: 'success'
        });
        this.$refs.addNewChallengeModal.clear();
      } else {
        this.$notifier.showMessage({
          content: this.$t('app.challenges.error_create'),
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
