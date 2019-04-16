<template>
  <v-layout column class="text-xs-left">
    <slot name="label"
      :label="labelText"
      :sublabel="sublabelText"
      :value="valueText">
      <div :class="{ 'text-xs-center': center }" class="px-1 pt-1">
        <span v-if="label !== undefined" class="grey--text font-weight-bold">{{ labelText }}</span>
        <span v-if="label !== undefined && sublabel !== undefined" class="caption grey--text text--darken-1">, </span>
        <span v-if="sublabel !== undefined" class="caption grey--text text--darken-1">{{ sublabelText }}</span>
      </div>
    </slot>
    <slot
      :label="labelText"
      :sublabel="sublabelText"
      :value="valueText">
      <span :class="{ 'text-xs-left': left, 'text-xs-center': center, 'text-xs-right': right }" class="px-1 pb-1 font-weight-bold body-2 grey--text text--darken-3 font-mono">{{ valueText }}</span>
    </slot>
  </v-layout>
</template>

<script>
export default {
  name: 'u-field',
  props: {
    label: [String, Function],
    sublabel: [String, Function],
    value: [String, Function],
    left: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    labelText() {
      return (typeof this.label === 'function'
        ? this.label.call(this.$parent)
        : this.label);
    },
    sublabelText() {
      return (typeof this.sublabel === 'function'
        ? this.sublabel.call(this.$parent)
        : this.sublabel);
    },
    valueText() {
      return (typeof this.value === 'function'
        ? this.value.call(this.$parent)
        : this.value);
    },
  }
};
</script>
