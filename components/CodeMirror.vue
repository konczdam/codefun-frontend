<template>
  <codemirror
    v-model="code"
    :options="cmOptions"
    @input="onCmCodeChange"
  />
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import { CODEMIRROR_MODES } from '@/const';
import { clone } from 'lodash';

export default {
  components: {
    codemirror,
  },
  props: {
    language: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    submitted: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  data() {
    return {
      code: null,
    };
  },
  computed: {
    cmOptions() {
      return {
        tabSize: 4,
        mode: {
          name: this.codeMirrorMode,
          json: false,
        },
        theme: 'default',
        lineNumbers: true,
        line: true,
        matchBrackets: true,
        readOnly: this.submitted,
      };
    },
    codeMirrorMode() {
      return CODEMIRROR_MODES[this.language];
    }
  },
  watch: {
    value() {
      this.code = clone(this.value);
    },
  },
  mounted() {
    this.code = clone(this.value);
  },
  methods: {
    onCmCodeChange(newCode) {
      this.$emit('input', newCode);
    }
  },
};
</script>

<style scoped>
</style>
