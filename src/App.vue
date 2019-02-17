<template>
  <div id="app" :class="{'sidebar-collapsed': isSidebarCollapsed}">
    <TheHeader :isScrolled="isScrolled" @login="logIn($event)"/>
    <aside>
      <SidebarSectionNav 
        class="sidebar-section"
        title="Markets"
        :items="markets"
        :getPath="(market, mic) => `/markets/${mic}`"
        :getInnerHtml="(market, mic) => market.name">
        </SidebarSectionNav>
      <SidebarSectionNav 
        class="sidebar-section"
        title="Watchlists"
        :items="watchlists"
        :getPath="(watchlist) => `/watchlists/${watchlist.uuid}`"
        :getInnerHtml="(watchlist) => watchlist.name">
        </SidebarSectionNav>
    </aside>
    <ButtonArrowHamburger :isActive="isSidebarCollapsed" @toggle="isSidebarCollapsed = !$event" class="btn-arrow-burger"/>
      <TheMainHeading class="main-heading"/>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import TheMainHeading from "./components/TheMainHeading.vue";
import ButtonArrowHamburger from "./components/ButtonArrowHamburger.vue";
import SidebarSectionNav from "./components/SidebarSectionNav.vue";

export default {
  name: "app",
  components: {
    TheHeader,
    TheMainHeading,
    ButtonArrowHamburger,
    SidebarSectionNav
  },
  computed: {
    markets() {
      return this.$store.state.marketData.markets;
    },
    watchlists() {
      return this.$store.state.investments.watchlists;
    }
  },
  data() {
    return {
      isScrolled: window.scrollY !== 0,
      isSidebarCollapsed: window.innerWidth < 600
    };
  },
  methods: {
    setIsScrolled() {
      this.isScrolled = window.scrollY !== 0;
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

<style scoped>
#app {
  min-height: 100%;
}

#app > header {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 60px;
  z-index: 2;
  background-color: #fff;
}

aside {
  position: fixed;
  top: 61px;
  height: calc(100vh - 61px);
  z-index: 2;
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 256px;
  transition: width ease 300ms, border-color 100ms ease 100ms;
}

.sidebar-collapsed aside {
  width: 0;
  border-right: 1px solid transparent;
}

.sidebar-collapsed .main-heading {
  left: 50px;
  width: 100%;
}

.sidebar-collapsed main {
  left: 0;
  width: 100%;
}

.sidebar-section {
  width: 100%;
  margin-top: 8px;
  transition: all ease 300ms;
}

.sidebar-collapsed .sidebar-section {
  transform: translateX(-256px);
  opacity: 0;
}

.btn-arrow-burger {
  position: fixed;
  z-index: 3;
  top: 61px;
  left: 186px;
  transition: all ease 300ms;
}

.sidebar-collapsed .btn-arrow-burger {
  left: 0;
}

main {
  position: absolute;
  display: flex;
  align-items: flex-start;
  min-height: calc(100% - 61px);
  box-sizing: border-box;
  padding: 70px 22px 22px;
}

@media only screen and (min-width: 1200px) {
  .sidebar-collapsed main {
    padding: 70px 70px 70px;
  }
}

.main-heading {
  position: fixed;
  padding-left: 22px; 
  height: 70px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
}

main,
.main-heading {
  top: 61px;
  left: 256px;
  width: calc(100% - 256px);
  transition: all ease 300ms;
}
</style>
