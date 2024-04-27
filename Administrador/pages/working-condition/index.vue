<template lang="pug">
pagination(
  title="Lista de Tipos de Contrato",
  :headers="headers",
  model="contract-type"
)
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Tipos de Contrato" };
  },
})
export default class ContracTypePage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
