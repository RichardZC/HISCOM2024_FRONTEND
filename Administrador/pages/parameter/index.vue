<template lang="pug">
pagination(title="Lista de Parámetros", :headers="headers", model="parameter")
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Parámetros" };
  },
})
export default class EmployeeTypePage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Llave", value: "llave" },
    { text: "Valor", value: "valor" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
