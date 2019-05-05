import Vue from 'vue';
import { client } from '@/apollo';

export default {
  data() {
    return {
      client,
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

    if (!this.watchQuery)
      return;

    this.watchQuery = client.watchQuery(this.watchQuery);

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
