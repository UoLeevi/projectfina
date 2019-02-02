<template>
  <form id="login" @submit.prevent="submitCredentials">
    <InputWithFloatingLabel
      ref="email"
      class="email"
      inputId="email"
      type="email"
      labelText="email"
      :autofocus="true"
      v-model="email"
    />
    <InputWithFloatingLabel
      ref="password"
      class="password"
      inputId="password"
      type="password"
      labelText="password"
      v-model="password"
    />
    <button id="login-submit" type="submit">
      <div v-if="user.isRequesting" class="three-dot-loader"></div>
      <span v-else>log in</span>
    </button>
  </form>
</template>

<script>
import InputWithFloatingLabel from "./InputWithFloatingLabel.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "TheLogin",
  components: {
    InputWithFloatingLabel
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    validateEmail() {
      return /^\S+@\S+$/.test(this.email);
    },
    validatePassword() {
      return !!this.password;
    },
    ...mapActions("user", ["logIn"]),
    submitCredentials() {
      if (!this.validateEmail()) {
        this.$el.querySelector("#email").focus();
        this.$refs["email"].signalRed();
        return;
      }
      if (!this.validatePassword()) {
        this.$el.querySelector("#password").focus();
        this.$refs["password"].signalRed();
        return;
      }
      this.logIn({ email: this.email, password: this.password });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login {
  display: flex;
  align-items: center;
}

button {
  width: 90px;
  height: 32px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background-color: transparent;
  outline: none;
  color: #666666;
  transition: all ease 200ms;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
}

button:hover {
  background-color: #3366cc;
  border-color: #3366cc;
  color: #ffffff;
  cursor: pointer;
}

.email {
  width: 220px;
}

.password {
  width: 160px;
}

/* animation three-dot-loader */
.three-dot-loader,
.three-dot-loader:before,
.three-dot-loader:after {
  border-radius: 50%;
  width: 8px;
  height: 8px;
  animation-fill-mode: both;
  animation: 1.8s infinite ease-in-out three-dot-loader;
}

.three-dot-loader {
  color: rgba(0, 0, 0, 0.2);
  font-size: 8px;
  margin: auto;
  position: relative;
  transform: translateY(-8px);
  animation-delay: -0.16s;
  transition: all ease 200ms;
}

button:hover .three-dot-loader {
  color: rgba(255, 255, 255, 0.7);
}

.three-dot-loader:before,
.three-dot-loader:after {
  content: "";
  position: absolute;
  top: 0;
}

.three-dot-loader:before {
  left: -15px;
  animation-delay: -0.32s;
}

.three-dot-loader:after {
  left: 15px;
}

@keyframes three-dot-loader {
  0%,
  80%,
  100% {
    box-shadow: 0 8px 0 -4px;
  }

  40% {
    box-shadow: 0 8px 0 0;
  }
}
/* */
</style>
