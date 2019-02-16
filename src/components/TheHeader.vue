<template>
  <header id="header" :class="{ 'is-scrolled': isScrolled }">
    <h2 v-cloak>Project Fina</h2>
    <transition name="fade-replace">
      <TheUserInfo v-if="user.jwt" v-cloak/>
    </transition>
    <transition name="fade-replace">
      <TheLogin v-if="!user.jwt" v-cloak/>
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
    ...mapState([
      "user"
      ])
  },
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
  justify-content: space-between;
  align-items: center;
  transition: box-shadow ease 200ms;
  white-space: nowrap;
}

#header > *:first-child {
  margin: 0 0 0 30px;
}

#header > *:last-child {
  margin: 0 30px 0 0;
}

#header.is-scrolled {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.06),
    0px 4px 5px 0px rgba(0, 0, 0, 0.06), 0px 1px 10px 0px rgba(0, 0, 0, 0.08);
}

.fade-replace-enter {
  opacity: 0;
}
.fade-replace-enter-active {
  transition: opacity ease-in 300ms 300ms;
}

.fade-replace-leave-active {
  transition: opacity ease-in 300ms;
}
.fade-replace-leave-to {
  opacity: 0;
}
</style>
