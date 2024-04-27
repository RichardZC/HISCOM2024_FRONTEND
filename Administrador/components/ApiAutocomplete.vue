<template lang="pug">
v-autocomplete(
  v-bind="$attrs",
  :filter="() => true",
  :items="items",
  :loading="isLoading",
  :search-input.sync="search",
  :value="value",
  @input="onInputChange($event)"
)
</template>
<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";

const apiAutocompleteProps = Vue.extend({
  name: "ApiAutocomplete",
  props: {
    value: { type: [String, Number, Array], default: undefined },

    model: { type: String, required: true },
    itemsPerPage: { type: [String, Number], default: 10 },
    queryParams: { type: Object, default: () => ({}) },
    first: { type: [Number, String], default: null },

    /* label: { type: String, required: true },
    itemText: { type: String, required: true },
    itemValue: { type: [String, Array, Function], required: true }, */

    useDb: { type: Boolean, default: false },
  },
});

@Component
export default class ApiAutocomplete extends apiAutocompleteProps {
  searchTimeout?: NodeJS.Timeout = undefined;

  isLoading: boolean = false;
  flag: boolean = false;
  search: string = "";
  items: any[] = [];

  @Watch("queryParams", { deep: true })
  async onQueryParamsChange() {
    this.isLoading = true;
    const { data } = await this.$axios.get(`/api/${this.model}`, {
      params: {
        itemsPerPage: this.itemsPerPage,
        useDB: this.useDb,
        first: this.first,
        ...this.queryParams,
      },
    });
    this.items = data.items;
    this.isLoading = false;
    this.$emit("q-fetch");
  }

  @Watch("search")
  onSearchChange(input: string | null) {
    // Items have already been requested
    // if (this.isLoading) return;

    // if (!input) return;
    if (this.flag) {
      this.flag = false;
      return;
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.isLoading = true;
    this.searchTimeout = setTimeout(async () => {
      const { data } = await this.$axios.get(`/api/${this.model}`, {
        params: {
          itemsPerPage: this.itemsPerPage,
          search: input || "",
          useDB: this.useDb,
          first: this.first,
          ...this.$props.queryParams,
        },
      });
      this.items = data.items;
      this.isLoading = false;
    }, 750);
  }

  onInputChange(input: any) {
    this.$emit("input", input);
    this.flag = true;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.isLoading = false;
    this.$emit("change", input);
  }

  async mounted() {
    this.isLoading = true;
    const { data } = await this.$axios.get(`/api/${this.model}`, {
      params: {
        itemsPerPage: this.itemsPerPage,
        useDB: this.useDb,
        first: this.first,
        ...this.queryParams,
      },
    });
    this.items = data.items;

    this.isLoading = false;
  }
}
</script>
