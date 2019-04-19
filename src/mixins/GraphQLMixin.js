import Vue from 'vue';
import { client } from '@/apollo';
import gql from 'graphql-tag';

export default {
  data() {
    return {
      query: null,
      loading: true,
      error: null,
      graph: {}
    };
  },
  async created() {
    try {
      if (this.query) {
        const query = gql`${ typeof this.query === 'function' ? this.query() : this.query }`;
        const res = await client.query({ query });
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
};
