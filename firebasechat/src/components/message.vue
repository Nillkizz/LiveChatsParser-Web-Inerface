<template lang="pug">
.message(:id="id")
  .header
    .info
      //- button.id(@click="copyId") \#{{ id }} 
      span {{ formatedDateTime }}
    .author
      img.socialIcon(:src="socialIcon")
      span.name {{ author }}
  .body
    .text {{ text }}
</template>

<script>
import { DateTime } from "luxon";

const socials = {
  ok: {
    icon: require("@/assets/images/ok.png"),
  },
  vk: {
    icon: require("@/assets/images/vk.png"),
  },
  yt: {
    icon: require("@/assets/images/yt.png"),
  },
  fb: {
    icon: require("@/assets/images/fb.png"),
  },
  inst: {
    icon: require("@/assets/images/inst.png"),
  },
};
export default {
  name: "message",
  props: {
    id: Number,
    social: String,
    author: String,
    text: String,
    datetime: String,
  },
  mounted(){
    this.$emit('mounted')
  },
  computed: {
    formatedDateTime() {
      const dt = DateTime.fromISO(this.datetime);
      return dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
    },
    socialIcon() {
      return socials[this.social].icon;
    },
  },
  methods: {
    // copyId(){
    //   navigator.clipboard.writeText(this.id);
    //   alert("Скопирован id сообщения: " + this.id);
    // }
  }
};
</script>

<style lang="sass" scoped>
.message
  border: 1px solid #888
  border-radius: 5px
  padding: .5rem
  margin-bottom: .4rem
  display: flex
  flex-direction: column
  gap: .3rem
  .header
    display: flex
    flex-direction: row-reverse
    justify-content: space-between
    font-size: .8rem
    .info
      display: flex
      color: gray
      gap: .3rem
      // .id
      //   color: gray
      //   text-decoration: underline
      //   background-color: transparent
      //   border: none
      //   cursor: pointer
    .author
      display: flex
      gap: .3rem
      .socialIcon
        height: 1.3rem
        width: 1.3rem
      .name
        align-self: center
        padding-top: .15rem
  .body
    .text
      word-wrap: anywhere
</style>
