<template>
  <v-sheet>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          @click="modalOpen = !modalOpen"
        >
          mdi-format-list-bulleted
        </v-icon>
      </template>
      <span> tooltip </span>
    </v-tooltip>
    <v-dialog
      v-model="modalOpen"
      max-width="680px"
    >
      <v-sheet>
        <v-list>
          <v-list-group
            v-for="testcase in testCases"
            :key="testcase.id"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="testcase.displayName" />
              </v-list-item-content>
            </template>

            <v-sheet>
              <test-case-example :challenge-test="testcase" />
            </v-sheet>
          </v-list-group>
        </v-list>
      </v-sheet>
    </v-dialog>
  </v-sheet>

</template>

<script>
import TestCaseExample from '@/components/TestCaseExample';

export default {
  components: {
    TestCaseExample,
  },
  props: {
    testCases: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      modalOpen: false,
    };
  },
};
</script>
