<template>
  <v-dialog
    v-model="modalOpen"
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
      >
        mdi-format-list-bulleted
      </v-icon>
    </template>
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
            Activated!!
          </v-sheet>
        </v-list-group>
      </v-list>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
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

<style scoped>

</style>
