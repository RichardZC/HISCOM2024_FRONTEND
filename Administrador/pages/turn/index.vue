<template lang="pug">
pagination(title="Lista de Turnos", :headers="headers", model="turn")
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Turnos" };
  },
})
export default class TurnPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Descripcion", value: "descripcion" },
    { text: "Horas", value: "horas" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
