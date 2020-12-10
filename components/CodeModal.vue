<template>
  <v-dialog
    v-model="modalOpen"
    max-width="800px"
  >
    <template v-slot:activator="{ on, attrs}">
      <v-btn
        color="orange"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>
          mdi-eye
        </v-icon>
        {{ $t('app.results.check_code') }}
      </v-btn>
    </template>
    <v-card>
      <code-mirror
        v-model="code"
        :language="language"
        :submitted="true"
        :style="{ 'margin-left': '10px' }"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import CodeMirror from '@/components/CodeMirror';

export default {
  components: {
    CodeMirror,
  },
  props: {
    code: {
      required: true,
      type: String,
    },
    language: {
      type: String,
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
