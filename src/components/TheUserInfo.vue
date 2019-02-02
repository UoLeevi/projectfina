<template>
  <div 
    id="user-info">
    {{user.firstName}}
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
  align-items: center;
}

</style>
