<template lang="pug">
div
  pagination(
    title="Categorías",
    model="category",
    :headers="headers",
  )
    template(v-slot:header-end)
      v-btn(color="primary", :loading="isLoadingAssign", @click="$router.push('/category/assign')") Asignar
    template(v-slot:item.color="{ item }")
      div.color-box(:style="{ backgroundColor:item.color }")
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Categorías" };
  },
})
export default class ShiftWorkPage extends Vue {
  isLoadingAssign: boolean = false;

  headers: any = [
    // ...this.a,
    { text: "ID", value: "id", width: 75 },
    { text: "Color", value: "color", width: 125, sortable: false },
    {
      text: "Denominacion",
      value: "denominacion",
    },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];
}
</script>
<style>
.color-box {
  border-radius: 8px;
  border: 1px solid black;
  width: 40px;
  height: 40px;
}
</style>
