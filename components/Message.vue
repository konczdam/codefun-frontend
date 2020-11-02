<template>
  <div>
    <div
      v-for="(message, idx) in messages"
      :key="idx"
      :class="{ own: message.userId === userId}"
      class="message"
    >
      <div
        v-if="idx === 0 || (idx > 0 && messages[idx-1].userId !== message.userId )"
        class="username mb-3"
      >
        {{ message.username }}
      </div>

      <div class="content">
        <div>
          {{ message.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  computed: {
    userId() {
      return this.$auth.$storage.getUniversal('user').id.toString();
    },
  },
};
</script>

<style scoped lang="scss">
  .message {
    margin-bottom: 5px;

    &.own {
      text-align: right;

      .content {
        background-color: lightskyblue;
      }
    }
  }

  .username {
    font-size: 18px;
    font-weight: bold;
  }

  .content{
    padding: 8px;
    background-color: lightgreen;
    border-radius: 10px;
    display:inline-block;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    max-width: 50%;
    word-wrap: break-word;
  }
</style>
