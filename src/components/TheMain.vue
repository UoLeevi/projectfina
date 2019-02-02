<template>
  <main 
    id="main">
  </main>
</template>

<script>

export default {
  name: "TheMain",
  components: {
  },
  props: {
    selection: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  display: flex;
  align-items: flex-start;
}

</style>
