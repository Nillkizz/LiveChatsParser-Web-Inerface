<template lang="pug">
.chat
  message(
    v-for="(msg, id) in messages",
    :social="msg.social",
    :author="msg.author",
    :text="msg.text",
    :datetime="msg.datetime",
    @mounted="toBottom(0)"
  )
  #chat-bottom
.overlayControls
  button(@click="toBottom") ↓↓↓
  button(
    @click="autoScroll = !autoScroll",
    :class="{ 'line-through': !autoScroll }"
  ) AutoScroll
</template>

<script>
import message from "./components/message.vue";
import { subscribeToMessages, updateMessages } from "@/firebase";

export default {
  name: "App",
  components: {
    message,
  },
  data() {
    return {
      autoScroll: window.location.hash.length === 0,
      messages: [],
    };
  },
  mounted() {
    subscribeToMessages(this.updateMessages);
  },
  methods: {
    updateMessages(messages) {
      if (!window.filtered) messages = updateMessages(messages);
      this.messages = messages;
    },
    toBottom(strength) {
      if (strength < 1 && !this.autoScroll) return;
      document.getElementById("chat-bottom").scrollIntoView();
    },
  },
};
</script>

<style lang="sass">
html, body
  min-height: 100vh
  scroll-behavior: smooth
body
  margin: 0
  padding: 0
  display: flex
  justify-content: center
  background: gray
  color: #333
.line-through
  text-decoration: line-through
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background: white
  width: 100%
  max-width: 600px
  min-height: 100%
  padding: 3rem
  display: flex
  flex-direction: column
  justify-content: flex-end
  .overlayControls
    position: fixed
    right: 1rem
    bottom: 1rem
    display: flex
    gap: 1rem
    button
      min-height: 2.5rem
      min-width: 2.5rem
      border: none
      cursor: pointer
      color: white
      background: black
      padding: .5rem
      border-radius: 5px
</style>
