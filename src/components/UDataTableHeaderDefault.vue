<template>
  <th scope="col" 
    :style="header.width ? `width: ${header.width};` : ''"
    :class="[
      'column', 
      header.sortable ? 'sortable' : '', 
      `text-xs-${header.align}`
    ]"
  >
    <v-icon v-if="header.sortable" small>arrow_upward</v-icon>
    <slot></slot>
  </th>
</template>

<script>
export default {
  props: {
    header: Object
  }
}
</script>
