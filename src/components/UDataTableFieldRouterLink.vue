<template>
  <td scope="row"
    :class="[
      `text-xs-${field.align}`
    ]">
    <router-link :to="typeof to === 'function' ? to() : to" exact>
      <slot></slot>
    </router-link>
  </td>
</template>

<script>
export default {
  props: {
    field: Object,
    to: [String, Function]
  }
}
</script>
