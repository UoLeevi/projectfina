import Vue from 'vue';
import { client } from '@/apollo';
import gql from 'graphql-tag';

export default {
  data() {
    return {
      client,
      unsubscribeOnClearStore: null,
      watchQuery: null,
      loading: true,
      error: null,
      graph: {},
    };
  },
  async created() {
    this.watchQuery = (this.watchQuery 
      ? typeof this.watchQuery === 'function' 
        ? this.watchQuery() 
        : this.watchQuery 
      : null);

    this.watchQuery = (typeof this.watchQuery === 'object'
      ? this.watchQuery 
      : gql(this.watchQuery));

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
    if (this.watchQuery) {
      client
        .watchQuery({ query: this.watchQuery })
        .subscribe(res => {
          this.error = res.error;
          this.loading = res.loading;
          for (const key in res.data)
            if (res.data.hasOwnProperty(key))
              Vue.set(this.graph, key, res.data[key]);
        });
    }
  }
  catch (e)
  {
    this.error = e;
    this.loading = false;
  }
}
