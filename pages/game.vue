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
            :submitted="submitted"
            stlye="height: 100%"
          />
          <v-divider />
          <span v-if="room.gameType === 'CODE_GOLF'">
            Code length: {{ code.length }}
          </span>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="3">
        <v-card elevation="4" outlined>
          <v-card-title>
            People in the room
          </v-card-title>
          <basic-mid-game-people-table :players="players" />
        </v-card>
      </v-col>
      <v-col sm="3">
        <v-card elevation="4" outlined min-height="150px" max-height="250px" class="scroll">
          <v-card-title>
            Console output
            <v-spacer />
            <detailed-console-output-modal
              v-if="lastCodeRunResponse && lastCodeRunResponse.errorMessage"
              :console-output="lastCodeRunResponse.errorMessage"
            />
          </v-card-title>
          <v-card-text
            v-if="lastCodeRunResponse && lastCodeRunResponse.errorMessage"
            v-html="replaceLineBreakWithBreak(lastCodeRunResponse.errorMessage)"
          />
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
            :item-class="row_class"
            :loading="!canSendExecuteCode"
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
                :disabled="!canSendExecuteCode || submitted"
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
              <v-col v-if="canSendExecuteCode && submitted" sm="12">
                <v-btn
                  color="primary"
                  @click="goToResults"
                >
                  Go to results
                </v-btn>
              </v-col>
              <v-col v-else sm="12">
                <v-btn
                  right
                  color="primary"
                  class="text-right"
                  :disabled="!canSendExecuteCode"
                  @click="runAllTestCases"
                >
                  <v-icon left>
                    mdi-play
                  </v-icon>
                  Run all
                </v-btn>

                <v-dialog
                  v-model="submitDialogOpen"
                  persistent
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      right
                      color="success"
                      class="text-right"
                      :disabled="!canSendExecuteCode"
                      style="margin-top: 10px"
                      v-bind="attrs"
                      v-on="on"
                      @click="submitDialogOpen = !submitDialogOpen"
                    >
                      <v-icon left>
                        mdi-checkbox-marked-circle-outline
                      </v-icon>
                      Submit
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      Confirm submitting
                    </v-card-title>
                    <v-card-text>
                      Do you really want to submit your solution? You won't be able change it later!
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="secondary"
                        @click="submitDialogOpen = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        right
                        color="success"
                        class="text-right"
                        :disabled="!canSendExecuteCode"
                        @click="submitCode"
                      >
                        <v-icon left>
                          mdi-checkbox-marked-circle-outline
                        </v-icon>
                        Submit
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
import { replaceLineBreakWithBreak } from '@/util';
import Timer from '@/components/Timer';
import DetailedTestCasesModal from '@/components/DetailedTestCasesModal';
import TestCaseExample from '@/components/TestCaseExample';
import DetailedConsoleOutputModal from '@/components/DetailedConsoleOutputModal';
import BasicMidGamePeopleTable from '@/components/BasicMidGamePeopleTable';

export default {
  layout: 'navigation_drawer',
  components: {
    CodeMirror,
    Timer,
    DetailedTestCasesModal,
    TestCaseExample,
    DetailedConsoleOutputModal,
    BasicMidGamePeopleTable,
  },
  data() {
    return {
      AVAILABLE_LANGUAGES,
      selectedLanguage: AVAILABLE_LANGUAGES[0],
      code: '',
      errorMessage: null,
      submitDialogOpen: false,
      canSendExecuteCode: true,
      submitted: false,
      lastRunTests: [],
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
    };
  },
  computed: {
    ...mapGetters({
      roomList: 'main/roomList',
      roomOwnerId: 'main/roomOwnerId',
      lastCodeRunResponse: 'main/codeRunResponse',
    }),
    lastCodeRunResponseMap() {
      const result = {};
      if (this.lastCodeRunResponse == null) {
        return result;
      }

      this.lastCodeRunResponse.testResults.forEach((testResult) => {
        result[testResult.testName] = testResult.passed;
      });

      return result;
    },
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
        console.log(response);
        if (mutation.payload != null) {
          this.canSendExecuteCode = true;
        }
      }
    });
    this.subscribeToGameEnd(this.room.owner.id);
    this.subscribeToUserUpdate(this.room.owner.id);
    this.unsubscribeRoomGameTypeSet();
    this.unsubscribeToGameStarted();
    this.setEndDateForTimer(new Date(new Date().getTime() + (15 * 60 * 1000)));
  },
  mounted() {
    this.selectedLanguage = this.AVAILABLE_LANGUAGES[0];
    this.code = BASE_CODES[this.selectedLanguage];
  },
  methods: {
    startCase,
    replaceLineBreakWithBreak,
    ...mapActions({
      sendExecuteCode: 'websocket/sendExecuteCode',
      subscribeToGameEnd: 'websocket/subscribeToGameEnd',
      unsubscribeRoomGameTypeSet: 'websocket/unsubscribeRoomGameTypeSet',
      unsubscribeToGameStarted: 'websocket/unsubscribeToGameStarted',
      subscribeToUserUpdate: 'websocket/subscribeToUserUpdate',
      setCodeRunResponseToNull: 'main/setCodeRunResponseToNull',
      setEndDateForTimer: 'timer/setEndDate',
    }),
    tryTestCase(testId) {
      this.canSendExecuteCode = false;
      this.lastRunTests = [this.challenge.challengeTests.find(it => it.id === testId).displayName];
      this.setCodeRunResponseToNull();
      this.sendExecuteCode({
        code: this.code,
        testIds: [testId],
        challengeId: this.challenge.id,
        roomId: this.room.owner.id,
        submitted: false,
        language: this.selectedLanguage,
      });
    },
    runAllTestCases() {
      this.canSendExecuteCode = false;
      this.lastRunTests = this.challenge.challengeTests.map(it => it.displayName);
      this.setCodeRunResponseToNull();
      this.sendExecuteCode({
        code: this.code,
        testIds: [...this.challenge.challengeTests.map(it => it.id)],
        challengeId: this.challenge.id,
        roomId: this.room.owner.id,
        submitted: false,
        language: this.selectedLanguage,
      });
    },
    submitCode() {
      this.canSendExecuteCode = false;
      this.lastRunTests = this.challenge.challengeTests.map(it => it.displayName);
      this.setCodeRunResponseToNull();
      this.submitted = true;
      this.submitDialogOpen = false;
      this.sendExecuteCode({
        code: this.code,
        testIds: [...this.challenge.challengeTests.map(it => it.id)],
        challengeId: this.challenge.id,
        roomId: this.room.owner.id,
        submitted: true,
        language: this.selectedLanguage,
      });
    },
    row_class(test) {
      const passed = this.lastCodeRunResponseMap[test.displayName];
      if (passed) {
        return 'green';
      } else if (passed === false || (this.lastRunTests.includes(test.displayName) && this.canSendExecuteCode)) {
        return 'red';
      } else {
        return '';
      }
    },
    goToResults() {
      this.$router.push({ name: 'results' });
    },
  },
};
</script>

<style scoped>
 .innerCard {
   font-size: 15px !important;
   padding: 10px 10px 10px 16px;
 }

 .scroll {
   overflow-y: scroll
 }
</style>
