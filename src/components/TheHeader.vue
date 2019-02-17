<template>
  <header id="header" :class="{ 'is-scrolled': isScrolled }">
    <h2 v-cloak>Project Fina</h2>
    <transition name="fade-replace" mode="out-in">
      <TheUserInfo v-if="user.jwt" key="user-info"/>
      <TheLogin v-else key="login"/>
    </transition>
  </header>
</template>

<script>
import TheLogin from "./TheLogin.vue";
import TheUserInfo from "./TheUserInfo.vue";

import { mapState } from "vuex";

export default {
  name: "TheHeader",
  components: {
    TheLogin,
    TheUserInfo
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {},
  props: {
    isScrolled: Boolean
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: box-shadow ease 200ms;
  white-space: nowrap;
}

#header > * {
  margin: 0 15px 0 15px;
}

#header > *:first-child {
  margin-left: 30px;
  margin-right: auto;
}

#header > *:last-child {
  margin-right: 30px;
}

#header.is-scrolled {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.06),
    0px 4px 5px 0px rgba(0, 0, 0, 0.06), 0px 1px 10px 0px rgba(0, 0, 0, 0.08);
}
</style>
