<template>
  <div>
    <no-ssr placeholder="Codemirror Loading...">
      <codemirror v-model="code" :options="cmOptions" />
    </no-ssr>
    <button>
      {{ roomList.length }}
    </button>
    {{ roomList.length }}

  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/base16-dark.css';
import 'codemirror/lib/codemirror.css';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      code: 'int a = 10',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: { name: 'text/x-java', json: false },
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
      },
      socket: null,
      stompClient: null,
    };
  },
  computed: {
    ...mapGetters({ roomList: 'main/roomList' }),
  },
  mounted() {
    this.connect();
  },
  methods: {
    ...mapActions({ connect: 'websocket/connect' }),
  },
};
</script>
