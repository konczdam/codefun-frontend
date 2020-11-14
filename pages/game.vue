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
          <v-row justify="space-around">
            <v-col sm="5">
              <v-card elevation="0" outlined>
                <v-card-title class="innerCard">
                  Input
                </v-card-title>
                <v-card-text>
                  {{ challenge.challengeTests[0].input }}
                </v-card-text>
              </v-card>
            </v-col>
            <v-col sm="5">
              <v-card elevation="0" outlined>
                <v-card-title class="innerCard">
                  Expected Output
                </v-card-title>
                <v-card-text>
                  {{ challenge.challengeTests[0].expectedOutput }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
          />
          <v-divider />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="5">
        <v-card elevation="4" outlined>
          asdsss
        </v-card>
      </v-col>
      <v-col sm="3">
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
                @click="tryTestCase(item.id)"
                color="secondary"
              >
                Try Testcase
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AVAILABLE_LANGUAGES, BASE_CODES } from '@/const';
import CodeMirror from '@/components/CodeMirror';
import { startCase } from 'lodash';
import Timer from '@/components/Timer';
import DetailedTestCasesModal from '@/components/DetailedTestCasesModal';

export default {
  layout: 'navigation_drawer',
  components: {
    CodeMirror,
    Timer,
    DetailedTestCasesModal,
  },
  data() {
    return {
      AVAILABLE_LANGUAGES,
      selectedLanguage: AVAILABLE_LANGUAGES[0],
      code: '',
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
    }),
    room() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId);
    },
    challenge() {
      return this.room.challenge;
    }
  },
  watch: {
    selectedLanguage() {
      this.code = BASE_CODES[this.selectedLanguage];
    }
  },
  mounted() {
    this.selectedLanguage = this.AVAILABLE_LANGUAGES[0];
    this.code = BASE_CODES[this.selectedLanguage];
  },
  methods: {
    startCase,
    tryTestCase(testId) {
      console.log(testId);
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
