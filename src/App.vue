<template>
  <div id="app" :class="{'sidebar-collapsed': isSidebarCollapsed}">
    <TheHeader :isScrolled="isScrolled" @login="logIn($event)"/>
    <TheSidebar
      :isCollapsed="isSidebarCollapsed"
      :selectionLists="selectionLists"
      @select="setSelection($event)"
    />
    <div class="main-header">
      <ButtonArrowHamburger @toggle="isSidebarCollapsed = !$event" class="btn-arrow-burger"/>
      <TheMainHeading :selection="selection"/>
    </div>
    <TheMain :selection="selection"/>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import TheSidebar from "./components/TheSidebar.vue";
import TheMain from "./components/TheMain.vue";
import TheMainHeading from "./components/TheMainHeading.vue";
import ButtonArrowHamburger from "./components/ButtonArrowHamburger.vue";

export default {
  name: "app",
  components: {
    TheHeader,
    TheSidebar,
    TheMain,
    TheMainHeading,
    ButtonArrowHamburger
  },
  data() {
    return {
      isScrolled: window.scrollY !== 0,
      isSidebarCollapsed: false,
      selection: null,
      selectionLists: [
        {
          title: "Watchlists",
          itemType: "Watchlist",
          items: [
            {
              uuid: "7648709a-373d-4578-a414-b59e17a73a32",
              name: "Innovation",
              securities: []
            },
            {
              uuid: "ed9ee7b7-6ef1-4fdc-93fb-eff7fd6f3d20",
              name: "Growth",
              securities: [
                {
                  uuid: "aa86bf2e-9f30-4abd-8c12-68c9084f72db",
                  company: {
                    name: "Talenom Oyj"
                  },
                  symbol: "TNOM"
                }
              ]
            },
            {
              uuid: "bb28a92b-5224-432c-a8af-501418f94f58",
              name: "Value",
              securities: [
                {
                  uuid: "8cb570b4-f68e-4f29-955f-66b6a1ffb9fb",
                  company: {
                    name: "Nokia Oyj"
                  },
                  symbol: "NOKIA"
                },
                {
                  uuid: "4c393cbd-6982-45f4-8a06-18091531c927",
                  company: {
                    name: "Fortum Oyj"
                  },
                  symbol: "FORTUM"
                },
                {
                  uuid: "22c290c3-a342-4149-bc87-87762922a566",
                  company: {
                    name: "Nordea Bank Abp"
                  },
                  symbol: "NDA FI"
                }
              ]
            }
          ]
        },
        {
          title: "Dummys",
          itemType: "Dummy",
          items: [
            {
              uuid: "c079bcb6-bb70-4fe6-8988-f287b5721eda",
              name: "Dummy 1"
            },
            {
              uuid: "6acc13fe-ca88-4dce-83ea-bae30a51a96a",
              name: "Dummy 2"
            }
          ]
        }
      ]
    };
  },
  methods: {
    setIsScrolled() {
      this.isScrolled = window.scrollY !== 0;
    },
    setSelection(selection) {
      this.selection = selection;
    },
    logIn(credentials) {
      var request = new XMLHttpRequest();
      request.open("POST", "/auth", true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          //var data = JSON.parse(this.response);
          console.log(this.response);
          this.user = { firstName: "test" };
        } else {
          // We reached our target server, but it returned an error
          console.log(this.response);
          this.user = { firstName: "test" };
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
        console.log("error");
      };

      request.setRequestHeader("content-type", "application/json");
      request.send(JSON.stringify(credentials));
    }
  },
  created() {
    window.addEventListener("scroll", this.setIsScrolled);
  },
  destroyed: function() {
    window.removeEventListener("scroll", this.setIsScrolled);
  }
};
</script>

<style>
#app {
  min-height: 110vh;
}

#app > header {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 52px;
  z-index: 2;
  background-color: #fff;
}

#app > aside {
  position: fixed;
  top: 53px;
  min-height: calc(100vh - 53px);
  z-index: 2;
  background-color: #fff;
}

main {
  position: absolute;
  min-height: calc(100% - 53px);
  background-color: #f8f8f8;
}

.main-header {
  position: fixed;
  height: 54px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
}

main,
.main-header {
  top: 53px;
  left: 256px;
  width: calc(100% - 256px);
  transition: all ease 300ms;
}

.sidebar-collapsed main,
.sidebar-collapsed .main-header {
  left: 0;
  width: 100%;
}
</style>
