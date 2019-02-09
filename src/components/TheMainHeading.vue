<template>
  <div id="main-heading">
    <router-view name="heading"/>
  </div>
</template>

<script>
export default {
  name: "TheMainHeading",
  components: {},
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#main-heading > * {
  height: 100%;
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
  font-weight: 400;
  color: #bbb;
}
</style>
