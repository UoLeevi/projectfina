<template>
  <button
    :class="{'is-active': isActive}"
    class="hamburger"
    type="button"
    @click="$emit('toggle', isActive)">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
  </button>
</template>

<script>
export default {
  name: "ButtonArrowHamburger",
  props: {
    isActive: Boolean
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  background-color: transparent;
  outline: none;
  border: 0 solid transparent;
}

.hamburger {
  padding: 23px 23px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
  overflow: visible;
}

.hamburger-box {
  width: 24px;
  height: 24px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  transform: translateY(-50%);
}

.hamburger:hover .hamburger-inner,
.hamburger:hover .hamburger-inner::before,
.hamburger:hover .hamburger-inner::after {
  background-color: #3366cc;
}

.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
  transition: 
    transform 300ms ease 300ms,
    background-color 300ms ease 300ms;
}

.hamburger:not(.is-active) .hamburger-inner,
.hamburger:not(.is-active) .hamburger-inner::before,
.hamburger:not(.is-active) .hamburger-inner::after {
  transition: 
    transform 300ms ease 300ms,
    background-color 300ms ease;
}

.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: 24px;
  height: 1px;
  background-color: #bbb;
  position: absolute;
}
.hamburger-inner::before,
.hamburger-inner::after {
  content: "";
  display: block;
}
.hamburger-inner::before {
  top: -7px;
}
.hamburger-inner::after {
  bottom: -7px;
}

.hamburger:not(.is-active) .hamburger-inner::before {
  transform: translate(-6px, 1px) rotate(-45deg) scale(0.73, 1);
  background-color: #bbb;
}

.hamburger:not(.is-active) .hamburger-inner {
  transform: translateX(5px);
  background-color: transparent;
}

.hamburger:not(.is-active) .hamburger-inner::after {
  transform: translate(-6px, -1px) rotate(45deg) scale(0.73, 1);
  background-color: #bbb;
}

.hamburger:hover:not(.is-active) .hamburger-inner::before,
.hamburger:hover:not(.is-active) .hamburger-inner::after {
  background-color: #3366cc;
}
</style>
