<template>
  <v-list-group
    v-model="active"
    :prepend-icon="action"
    no-action>
    <template v-slot:activator>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title class="grey--text text--darken-1">{{ title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    <v-list-tile v-for="(item, index) in typeof items === 'function' ? items() : items" 
      :key="typeof itemKey === 'function' ? itemKey(item, index) : item[itemKey]"
      router :to="typeof itemRoute === 'function' ? itemRoute(item, index) : item[itemRoute]">
      <v-list-tile-content>
        <v-list-tile-title>{{ typeof itemTitle === 'function' ? itemTitle(item, index) : item[itemTitle] }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <slot name="footer"/>
  </v-list-group>
</template>

<script>

export default {
  props: {
    title: String,
    action: String,
    items: [Array, Function],
    itemKey: [String, Function],
    itemRoute: [String, Function],
    itemTitle: [String, Function]
  },
  data() {
    return {
      active: false
    };
  }
};
</script>
