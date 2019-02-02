<template>
  <aside 
    id="sidebar"
    :class="{'collapsed': isCollapsed}">
    <SidebarSectionSelectionList 
      v-cloak 
      v-for="selectionList in selectionLists"
      :key="selectionList.itemType"
      :selection="selection"
      :items="selectionList.items"
      :itemType="selectionList.itemType"
      :title="selectionList.title"
      @select="$emit('select', selection = $event)" />
  </aside>
</template>

<script>
import SidebarSectionSelectionList from "./SidebarSectionSelectionList.vue";

export default {
  name: "TheSidebar",
  components: {
    SidebarSectionSelectionList
  },
  props: {
    selectionLists: Array,
    isCollapsed: Boolean
  },
  data() {
    return {
      selection: null
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 256px;
  transition: 
    width ease 300ms,
    border-color 100ms ease 100ms;
}

#sidebar.collapsed {
  width: 0;
  border-right: 1px solid transparent;
}

#sidebar section + section {
  margin-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.14);
}

#sidebar section {
  width: 100%;
  margin-top: 5px;
  transition: all ease 300ms;
}

#sidebar.collapsed section {
  transform: translateX(-256px);
  opacity: 0;
}

</style>
