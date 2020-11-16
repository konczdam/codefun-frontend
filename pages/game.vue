<template>
  <div>
    <v-row justify="center">
      <v-col sm="5">
        <v-card elevation="4" outlined>
          <v-card-title>
            {{ challenge.title }}
          </v-card-title>
          <v-card-text>
            {{ challenge.description }}
          </v-card-text>
          <v-card-title style="padding-bottom: 0; padding-top: 0">
            Example
          </v-card-title>
          <test-case-example :challenge-test="challenge.challengeTests[0]" :inner="true" />
          <v-card-title style="padding-bottom: 0; padding-top: 0">
            Info
          </v-card-title>

          <v-row justify="space-around">
            <v-col sm="5">
              <v-card elevation="0" outlined>
                <v-card-title class="innerCard">
                  Game Type
                </v-card-title>
                <v-card-text style="padding-bottom: 6px">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        v-bind="attrs"
                        label
                        color="secondary"
                        v-on="on"
                      >
                        {{ startCase(room.gameType) }}
                      </v-chip>
                    </template>
                    <span> {{ $t('app.room.tooltip.' + room.gameType) }} </span>
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col sm="5">
              <v-card elevation="0" outlined>
                <v-card-title class="innerCard">
                  Remaining Time
                </v-card-title>
                <v-card-text>
                  <timer>
                    <template v-slot:default="slotProps">
                      {{ slotProps.min }}:{{ slotProps.sec }}
                    </template>
                  </timer>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col sm="7">
        <v-card elevation="4" outlined style="height: 100%">
          <v-form style="width: 50%" class="ml-4">
            <v-select
              v-model="selectedLanguage"
              :items="AVAILABLE_LANGUAGES"
            />
          </v-form>
          <code-mirror
            v-model="code"
            :language="selectedLanguage"
            stlye="height: 100%"
          />
          <v-divider />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="3">
        <v-card elevation="4" outlined>
          <v-card-title>
            People in the room
          </v-card-title>
          <v-data-table
            :key="JSON.stringify(players)"
            hide-default-header
            hide-default-footer
            :items="players"
            :headers="peopleTableHeaders"
          >
            <template #item.idx="{item}">
              {{ players.indexOf(item) + 1 }}
            </template>
            <template #item.name="{item}">
              {{ item.username }}
            </template>
            <template #item.status="{item}">
              {{ item.status || 'coding...' }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col sm="3">
        <v-card elevation="4" outlined min-height="150px">
          <v-card-title>
            Console output
          </v-card-title>
        </v-card>
      </v-col>
      <v-col sm="4">
        <v-card elevation="4" outlined>
          <v-card-title>
            Test Cases
            <v-spacer />
            <detailed-test-cases-modal
              :test-cases="challenge.challengeTests"
            />
          </v-card-title>
          <v-data-table
            hide-default-footer
            hide-default-header
            :items="challenge.challengeTests"
            :headers="tableHeaders"
          >
            <template #item.idx="{item}">
              {{ challenge.challengeTests.indexOf(item) + 1 }}
            </template>

            <template #item.name="{item}">
              {{ item.displayName }}
            </template>

            <template #item.actions="{item}">
              <v-btn
                color="secondary"
                :disabled="!canSendExecuteCode"
                @click="tryTestCase(item.id)"
              >
                <v-icon left>
                  mdi-play
                </v-icon>
                Try Testcase
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col sm="2">
        <v-card elevation="4" outlined>
          <v-card-title>
            Actions
          </v-card-title>
          <v-card-actions>
            <v-row justify="center">
              <v-col sm="12">
                <v-btn
                  right
                  color="primary"
                  width="90%"
                  class="text-right"
                  :disabled="!canSendExecuteCode"
                  @click="runAllTestCases"
                >
                  <v-icon left>
                    mdi-play
                  </v-icon>
                  Run all Test Cases
                </v-btn>

                <v-btn
                  right
                  color="success"
                  class="text-right"
                  width="90%"
                  :disabled="!canSendExecuteCode"
                  style="margin-top: 10px"
                >
                  <v-icon left>
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { AVAILABLE_LANGUAGES, BASE_CODES } from '@/const';
import CodeMirror from '@/components/CodeMirror';
import { startCase } from 'lodash';
import Timer from '@/components/Timer';
import DetailedTestCasesModal from '@/components/DetailedTestCasesModal';
import TestCaseExample from '@/components/TestCaseExample';

export default {
  layout: 'navigation_drawer',
  components: {
    CodeMirror,
    Timer,
    DetailedTestCasesModal,
    TestCaseExample,
  },
  data() {
    return {
      AVAILABLE_LANGUAGES,
      selectedLanguage: AVAILABLE_LANGUAGES[0],
      code: '',
      errorMessage: null,
      canSendExecuteCode: true,
      submitted: false,
      tableHeaders: [
        {
          value: 'idx',
        },
        {
          value: 'name',
        },
        {
          value: 'actions',
          align: 'right',
        },
      ],
      peopleTableHeaders: [
        {
          value: 'idx',
        },
        {
          value: 'name',
        },
        {
          value: 'status',
          align: 'right',
        }
      ],
    };
  },
  computed: {
    ...mapGetters({
      roomList: 'main/roomList',
      roomOwnerId: 'main/roomOwnerId',
    }),
    room() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId);
    },
    challenge() {
      return this.room.challenge;
    },
    players() {
      return [this.room.owner, ...this.room.others];
    },
  },
  watch: {
    selectedLanguage() {
      this.code = BASE_CODES[this.selectedLanguage];
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'main/setCodeRunResponse') {
        const response = state.main.codeRunResponse;
        this.canSendExecuteCode = true;
        console.log(response);
      }
    });
  },
  mounted() {
    this.selectedLanguage = this.AVAILABLE_LANGUAGES[0];
    this.code = BASE_CODES[this.selectedLanguage];
  },
  methods: {
    startCase,
    ...mapActions({
      sendExecuteCode: 'websocket/sendExecuteCode',
    }),
    tryTestCase(testId) {
      this.canSendExecuteCode = false;
      this.sendExecuteCode({
        code: this.code,
        testIds: [testId],
        challengeId: this.challenge.id,
        roomId: this.room.owner.id,
        submitted: false,
      });
    },
    runAllTestCases() {
      this.canSendExecuteCode = false;
      this.sendExecuteCode({
        code: this.code,
        testIds: [...this.challenge.challengeTests.map(it => it.id)],
        challengeId: this.challenge.id,
        roomId: this.room.owner.id,
        submitted: false,
      });
    },
    submitCode() {
      this.canSendExecuteCode = false;
      this.submitted = true;
      this.sendExecuteCode({
        code: this.code,
        testIds: [...this.challenge.challengeTests.map(it => it.id)],
        challengeId: this.challenge.id,
        roomId: this.room.owner.id,
        submitted: true,
      });
    }
  },
};
</script>

<style scoped>
 .innerCard {
   font-size: 15px !important;
   padding: 10px 10px 10px 16px;
 }
</style>
