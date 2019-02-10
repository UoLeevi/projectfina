<template>
  <section 
    v-cloak>
    <h3>{{title}}</h3>
    <nav>
      <ul>
        <li 
          v-for="(item, index) in items" 
          :key="getPath(item, index)">
          <router-link 
            :to="getPath(item, index)">{{ getInnerHtml(item, index) }}</router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
export default {
  name: "SidebarSectionNav",
  props: {
    title: String,
    routeName : String,
    items: [Object, Array],
    getInnerHtml: Function,
    getPath: Function
  }
};
</script>

<style scoped>
h3 {
  color: #bbb;
  margin: 10px 0 0 15px;
  font-weight: 400;
  font-size: 13px;
}

nav {
  margin: 0;
  padding: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  padding: 0;
  font-size: 14px;
  transition: all ease 120ms;
}

a {
  box-sizing: border-box;
  display: inline-block;
  padding: 2px 0 0 22px;
  width: 100%;
  height: 100%;
  font-weight: 400;
  color: #666666;
  text-decoration: none;
}

li .router-link-active {
  color: #3366cc;
}

li:hover {
  background-color: #f6f6f6;
}
</style>
