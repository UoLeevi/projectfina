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

    this.watchQuery = client.watchQuery({ query: this.watchQuery });

    const subscription = this.watchQuery.subscribe(({ data, loading, error }) => {
      this.error = error;
      this.loading = loading;
      for (const key in data)
        if (data.hasOwnProperty(key))
          Vue.set(this.graph, key, data[key]);
    });

    this.$options.destroyed = [
      client.onClearStore(this.watchQuery.refetch.bind(this.watchQuery)),
      subscription.unsubscribe.bind(subscription)
    ];

    try 
    {
      await this.watchQuery.result;
    }
    catch (e)
    {
      this.error = e;
      this.loading = false;
    }
  }
};
