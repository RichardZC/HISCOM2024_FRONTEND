<template lang="pug">
pagination(:headers="headers", model="employee", title="Lista de empleados")
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Empleados" };
  },
})
export default class EmployeePage extends Vue {
  // a = [{ text: "ID", value: "id" }];

  headers: any = [
    { text: "DNI", value: "numeroDoc", sortable: false },
    { text: "Nombre", value: "nombreCompleto", sortable: false },
    { text: "Estructura", value: "organigrama" },
    { text: "Cargo", value: "cargo", sortable: false },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
