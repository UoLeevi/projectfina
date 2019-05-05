<template>
  <v-layout row class="pb-3">
    <v-flex xs12>
      <h2 class="headline">{{ heading }}</h2>
      <v-breadcrumbs class="px-0 py-1 subheading font-weight-bold grey--text" :items="breadcrumbs">
        <template #item="props">
          <router-link :to="props.item.href" :class="[props.item.disabled && 'disabled']">{{ props.item.text }}</router-link>
        </template>
        <template #divider>
          <span class="subheading font-weight-bold grey--text text--lighten-1">/</span>
        </template>
    </v-breadcrumbs>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'u-heading-row',
  props: {
    heading: String,
    breadcrumbs: Array
  },
  created() {
    //console.log(this.$route.matched);
  }
}
</script>

