<template>
  <div 
    id="main-heading"
    v-if="selection">
    <h2>
      {{ selection.data.name }}
    </h2>
    <h4>
      <span>{{ selection.type }}</span>
    </h4>
  </div>
</template>

<script>

export default {
  name: "TheMainHeading",
  components: {
  },
  props: {
    selection: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main-heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
}

#main-heading h2 {
  margin: 0;
  line-height: 26px;
  font-size: 20px;
}

#main-heading h4 {
  margin: 0;
  line-height: 16px;
  font-size: 14px;
}

#main-heading h4 span {
  font-weight: 400;
  color: #bbb;
}
</style>
