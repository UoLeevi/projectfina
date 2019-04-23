import Vue from 'vue';
import { client } from '@/apollo';
import gql from 'graphql-tag';

export default {
  data() {
    return {
      client,
      unsubscribeOnClearStore: null,
      load: null,
      loading: true,
      error: null,
      graph: {},
    };
  },
  async created() {
    this.load = (this.load 
      ? gql`${ typeof this.load === 'function' 
        ? this.load() 
        : this.load }`
      : null);

    this.unsubscribeOnClearStore = client.onClearStore(executeQuery.bind(this));
    await executeQuery.call(this);
  },
  destroyed() {
    this.unsubscribeOnClearStore();
  }
};

async function executeQuery() {
  this.loading = true;
  this.error = null;
  this.graph = {};

  try {
    if (this.load) {
      const res = await client.query({ query: this.load });
      for (const key in res.data)
        if (res.data.hasOwnProperty(key))
          Vue.set(this.graph, key, res.data[key]);
    }
  }
  catch (e)
  {
    this.error = e;
  }
  finally
  {
    this.loading = false;
  }
}
