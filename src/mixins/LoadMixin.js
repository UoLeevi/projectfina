export default {
  methods: {
    async load(dependencies) {
      if (!dependencies)
        return;
      else if (typeof dependencies[Symbol.iterator] === 'function')
        for (const d of dependencies)
          await this.load(d);
      else if (typeof dependencies === 'function')
        await this.load(dependencies.apply(this));
      else
        await this.$store.dispatch('domain/load', dependencies);
    }
  },
  data() {
    return {
      dependencies: null,
      loading: true,
      error: null
    };
  },
  async created() {
    try 
    {
      await this.load(this.dependencies);
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
