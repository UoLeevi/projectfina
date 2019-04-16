<template>
  <td scope="row"
    :class="[
      `text-xs-${field.align}`
    ]">
    <slot></slot>
  </td>
</template>

<script>
export default {
  props: {
    field: Object
  }
}
</script>
