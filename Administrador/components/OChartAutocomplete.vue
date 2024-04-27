<template lang="pug">
v-autocomplete(
  :value="value",
  :items="ochart",
  filled,
  v-bind="$attrs",
  color="blue-grey lighten-2",
  :label="`${label}${required ? '*' : ''}`",
  item-text="denominacion",
  item-value="id",  
  @change="onChange($event)",
  @input="$emit('input', $event)"
)
  template(v-slot:item="{ item }")
    template(v-if="checkObject(item)")
      v-list-item-content(v-text="item")
    template(v-else)
      v-list-item-avatar
        v-icon mdi-domain
      v-list-item-content
        v-list-item-title(v-html="item.denominacion")
</template>
<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { OChart } from "~/types";

const ochartAutocompleteProps = Vue.extend({
  name: "OchartAutocomplete",
  props: {
    label: { type: String, default: "Estructura Orgánica" },
    value: { type: [String, Number], default: undefined },
    params: { type: Object, default: () => ({}) },
    noFill: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    showAbstracts: { type: Boolean, default: false },
  },
});

@Component
export default class OchartAutocomplete extends ochartAutocompleteProps {
  ochart: OChart[] = [];

  @Watch("value")
  onInput(val: number) {
    this.onChange(val);
  }

  async onChange(id: number) {
    this.$emit("change", id);
    if (!this.$props.noFill) {
      const { data } = await this.$axios({
        method: "GET",
        url: `/api/common/organization-chart/${id}/positions`,
        params: this.$props.params,
      });
      this.$emit("fillPositions", data);
    }
  }

  checkObject(item: any) {
    return typeof item !== "object";
  }

  recursive(arr: any[], input: OChart, concat?: string) {
    if (input.hijos && input.hijos.length > 0) {
      for (const el of input.hijos) {
        arr.push({
          id: el.id,
          denominacion: concat
            ? `${concat} - ${el.denominacion}`
            : el.denominacion,
        });
        if (el.hijos && el.hijos.length > 0) {
          this.recursive(arr, el, el.denominacion);
        }
      }
    }
  }

  flatten(items: OChart[]) {
    const result: any[] = [];
    const abstracts: any[] = [];
    const size = items.length - 1;
    items.forEach((el, i) => {
      abstracts.push(el);
      result.push({ header: el.denominacion });
      this.recursive(result, el);
      if (i < size) {
        result.push({ divider: true });
      }
    });
    return this.$props.showAbstracts ? [...abstracts, ...result] : result;
  }

  async mounted() {
    const { data } = await this.$axios.get(
      "/api/common/organization-chart/hierarchy",
    );
    this.ochart = this.flatten(data);

    if (this.$props.value) {
      this.$emit("change", this.$props.value);
    }
  }
}
</script>
