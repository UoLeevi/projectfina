<template>
  <th scope="col"
    :style="header.width ? `width: ${header.width};` : ''"
    :class="[
      'column',
      `text-xs-${header.align}`]"
  >
    <v-menu bottom left>
      <template #activator="{ on }">
        <v-btn
          icon
          v-on="on">
          <v-icon>more_vert</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-tile
          v-for="(item, index) in items"
          :key="item"
          @click="selectCb(index)">
          <v-list-tile-title>{{ item }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </th>
</template>

<script>
export default {
  props: {
    header: Object,
    items: Array,
    selectCb: Function
  }
}
</script>
