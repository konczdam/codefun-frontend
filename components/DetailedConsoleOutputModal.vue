<template>
  <v-sheet>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          @click="modalOpen = !modalOpen"
        >
          mdi-arrow-expand-all
        </v-icon>
      </template>
      <span>
        {{ $t('app.game.detailed_console_output.tooltip') }}
      </span>
    </v-tooltip>
    <v-dialog
      v-model="modalOpen"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          {{ $t('app.game.console_output') }}
        </v-card-title>
        <v-card-text
          v-html="replaceLineBreakWithBreak(consoleOutput)"
        />
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { replaceLineBreakWithBreak } from '@/util';

export default {
  props: {
    consoleOutput: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      modalOpen: false,
    };
  },
  methods: {
    replaceLineBreakWithBreak,
  },
};
</script>
