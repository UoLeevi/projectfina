<template>
  <div id="user-info">
    <div class="user-status">
      <span class="font-bold">{{ user.firstName }}</span> signed in<br>
      <span class="user-domain">{{ user.email.slice(user.email.indexOf('@')) }}</span>
    </div>
    <button @click.prevent="logOut">log out</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "TheUserInfo",
  components: {},
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions("user", ["logOut"])
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#user-info {
  display: flex;
  align-items: center;
}

.user-status {
  font-size: 0.9em;
  text-align: center;
  margin: 0 30px 0 0;
}

.user-domain {
  color: #666666;
  font-size: 0.8em;
}
</style>
