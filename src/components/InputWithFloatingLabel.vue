<template>
  <div class="input-with-floating-label" :class="{ 'has-value': value }">
    <label :for="inputId">{{labelText}}</label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="labelText"
      :spellcheck="spellcheck"
      :autofocus="autofocus"
      @input="$emit('input', $event.target.value)"
      @mouseup="emitInput"
      v-model="value"
    >
  </div>
</template>

<script>
export default {
  name: "InputWithFloatingLabel",
  data() {
    return {
      value: ""
    };
  },
  props: {
    type: String,
    inputId: String,
    labelText: String,
    spellcheck: Boolean,
    autofocus: Boolean
  },
  methods: {
    emitInput(event) {
      setTimeout(
        function() {
          if (this.value === event.target.value) return;
          this.value = event.target.value;
          this.$emit("input", event.target.value);
        }.bind(this),
        0
      );
    },
    signalRed() {
      this.$el.classList.add("signal-red");
      setTimeout(
        function() {
          this.$el.classList.remove("signal-red");
        }.bind(this),
        300
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-with-floating-label {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  font-weight: 400;
  margin-left: 4px;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  height: 36px;
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red {
  border-color: rgba(209, 52, 91, 0.7);
}

.input-with-floating-label label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  font-size: 11px;
  margin-left: 8px;
  color: #3366cc;
  visibility: hidden;
  transition: all ease-in-out 120ms;
  opacity: 0;
  transform: translateY(2px);
  pointer-events: none;
}

.input-with-floating-label.has-value label {
  visibility: visible;
  opacity: 1;
  transform: translateY(-1px);
}

.input-with-floating-label input {
  color: #666666;
  font-size: 13px;
  padding: 13px 8px 1px 8px;
  background-color: transparent;
  outline: none;
  border: 0 solid transparent;
  height: 36px;
}

/* placeholder */

::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #bbb;
  transform: translateY(-2px);
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red ::-webkit-input-placeholder {
  color: rgba(209, 52, 91, 0.7);
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #bbb;
  opacity: 1;
  transform: translateY(-2px);
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red :-moz-placeholder {
  color: rgba(209, 52, 91, 0.7);
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #bbb;
  opacity: 1;
  transform: translateY(-2px);
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red ::-moz-placeholder {
  color: rgba(209, 52, 91, 0.7);
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #bbb;
  transform: translateY(-2px);
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red :-ms-input-placeholder {
  color: rgba(209, 52, 91, 0.7);
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #bbb;
  transform: translateY(-2px);
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red ::-ms-input-placeholder {
  color: rgba(209, 52, 91, 0.7);
}

::placeholder {
  /* Most modern browsers support this now. */
  color: #bbb;
  transform: translateY(-2px);
  transition: all ease 200ms;
}

.input-with-floating-label.signal-red ::placeholder {
  color: rgba(209, 52, 91, 0.7);
}

/* */

/* autofill */

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset;
  box-shadow: 0 0 0 30px white inset;
}

/* */
</style>
