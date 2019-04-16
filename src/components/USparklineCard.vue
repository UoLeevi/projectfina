<template>
  <v-card v-bind="cardProps"
    class="text-xs-center">
    <v-fade-transition mode="out-in">
      <v-flex v-if="loading"
        class="text-xs-center">
        <v-progress-circular indeterminate color="primary"/>
      </v-flex>
      <v-flex v-else-if="error" >
        {{ error.message }}
      </v-flex>
      <v-flex v-else >
        <v-card-text class="pa-0">
          <slot name="header" 
            :first="{ label: firstLabel, value: firstValue }" 
            :last="{ label: lastLabel, value: lastValue }" 
            :min="{ label: minLabel, value: minValue }" 
            :max="{ label: maxLabel, value: maxValue }"
            :average="average" 
            :change="change" 
            :changePercent="changePercent" />
          <v-sheet color="transparent" :style="{ 
            'position': 'relative', 
            'width': sparklineWidth, 
            'height': sparklineHeight 
            }">
            <v-sparkline v-bind="sparklineProps"
              :style="{ 'width': '100%', 'height': '100%' }"
              auto-draw
              :auto-draw-duration="500"
              :value="scale(value)"
              :padding="8"
              :smooth="4"
              :gradient="['#2e7d32', '#1976d2' ,'#ec407A']"
              :line-width="1"
              stroke-linecap="round"
            />
          </v-sheet>
          <slot name="footer"
            :first="{ label: firstLabel, value: firstValue }" 
            :last="{ label: lastLabel, value: lastValue }" 
            :min="{ label: minLabel, value: minValue }" 
            :max="{ label: maxLabel, value: maxValue }"
            :average="average" 
            :change="change" 
            :changePercent="changePercent" />
        </v-card-text>
      </v-flex>
    </v-fade-transition>
  </v-card>
</template>

<script>
import { Uo } from '@/utilities';

export default {
  name: 'u-sparkline-card',
  props: {
    cardProps: {
      type: Object,
      default() {
        return {
          flat: true
        };
      }
    },
    sparklineProps: {
      type: Object
    },
    sparklineWidth: {
      type: [String, Number]
    },
    sparklineHeight: {
      type: [String, Number],
      default: '100px'
    },
    labels: {
      type: Array,
      required: false
    },
    value: {
      type: Array,
      required: true
    },
    high: {
      type: Array,
      required: false
    },
    low: {
      type: Array,
      required: false
    },
    loading: Boolean,
    error: Object
  },
  computed: {
    firstValue() {
      return this.loading || !this.value ? null : this.value[0];
    },
    firstLabel() {
      return this.loading || !this.labels ? null : this.labels[0];
    },
    lastValue() {
      return this.loading || !this.value ? null : this.value[this.value.length - 1];
    },
    lastLabel() {
      return this.loading || !this.labels ? null : this.labels[this.labels.length - 1];
    },
    minValue() {
      return this.loading ? null : Math.min(...(this.low || this.value || []));
    },
    minLabel() {
      return (!this.labels || this.minValue === null
        ? null 
        : this.labels[(this.low || this.value).indexOf(this.minValue)]);
    },
    maxValue() {
      return this.loading ? null : Math.max(...(this.high || this.value || []));
    },
    maxLabel() {
      return (!this.labels || this.maxValue === null
        ? null 
        : this.labels[(this.high || this.value).indexOf(this.maxValue)]);
    },
    average() {
      return this.loading || !this.value ? null : Uo.math.average(this.value);
    },
    change() {
      return (this.firstValue === null || this.lastValue === null 
        ? null 
        : (this.lastValue - this.firstValue));
    },
    changePercent() {
      return (this.change === null 
        ? null 
        : (this.change * 100 / this.firstValue));
    }
  },
  methods: {
    scale: Uo.math.scale,
  }
};
</script>

<style>
</style>
