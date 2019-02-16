<template>
  <div 
    id="user-info">
    <div class="user-status"><span class="font-bold">{{user.firstName}}</span> signed in</div>
    <div class="user-domain">{{user.email.slice(user.email.indexOf('@'))}}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'TheUserInfo',
  components: {

  },
  computed: {
    ...mapState([
      "user"
      ])
  },
  data() {
    return {

    };
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-status {
  font-size: 0.9em;
}

.user-domain {
  color: #666666;
  font-size: 0.8em;
}

</style>
