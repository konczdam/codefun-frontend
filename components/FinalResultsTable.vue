<template>
  <v-data-table
    :key="JSON.stringify(players)"
    hide-default-footer
    :items="players"
    :headers="peopleTableHeaders"
  >
    <template #item.idx="{item}">
      {{ players.indexOf(item) + 1 }}.
    </template>
    <template #item.name="{item}">
      {{ item.username }}
    </template>
    <template #item.language="{item}">
      {{ item.language }}
    </template>
    <template #item.timeTaken="{item}">
      {{ item.timeTaken / 1000 }} s
    </template>
    <template #item.runtime="{item}">
      {{ item.runTime }} ms
    </template>
    <template #item.codeLength="{item}">
      {{ item.finalCodeLength }}
    </template>
    <template #item.successRate="{item}">
      {{ truncToFourDecimals(item.successRate)*100 }} %
    </template>
    <template #item.actions="{item}">
      <code-modal
        :language="item.language"
        :code="item.code"
      />
    </template>
  </v-data-table>
</template>

<script>
import CodeModal from '@/components/CodeModal';

export default {
  components: {
    CodeModal,
  },
  props: {
    players: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      peopleTableHeaders: [
        {
          value: 'idx',
          text: '',
          fixed: true,
          width: '30px',
        },
        {
          value: 'name',
          text: 'Name',
        },
        {
          value: 'language',
          text: 'Language',
        },
        {
          value: 'timeTaken',
          text: 'Time taken',
        },
        {
          value: 'runtime',
          text: 'runtime',
        },
        {
          value: 'codeLength',
          text: 'Code length',
        },
        {
          value: 'successRate',
          text: 'Success rate',
        },
        {
          value: 'actions',
          text: 'Actions',
        }
      ],
    };
  },
  methods: {
    truncToFourDecimals(num) {
      if (num === 'NaN') {
        return 0;
      }
      return num.toFixed(4);
    }
  },
};
</script>
