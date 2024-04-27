<template lang="pug">
pagination(title="Lista de Cargos", :headers="headers", model="position")
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Cargos" };
  },
})
export default class PositionPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Codigo", value: "codigo" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
