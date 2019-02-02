<template>
  <section 
    v-if="items"
    v-cloak>
    <h3>{{title}}</h3>
    <ul>
      <li 
        v-for="item in items" 
        :key="item.uuid"
        :class="{'is-selected': selection && item.uuid === selection.data.uuid}"
        @click="$emit('select', { type: itemType, data: item })">
        {{ item.name }}
      </li>
    </ul>
  </section>
</template>

<script>

export default {
  name: "SidebarSectionSelectionList",
  props: {
    items: Array,
    itemType: String,
    title: String,
    selection: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  color: #bbb;
  margin: 10px 0 0 15px;
  font-weight: 400;
  font-size: 13px;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: 0 0 0 22px;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  transition: all ease 120ms;
}

li.is-selected {
  color: #3366cc;
}

li:hover {
  cursor: pointer;
  background-color: #f6f6f6;
}

</style>
