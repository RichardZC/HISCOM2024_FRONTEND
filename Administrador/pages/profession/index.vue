<template lang="pug">
pagination(title="Lista de Profesiones", :headers="headers", model="profession")
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Profesiones" };
  },
})
export default class ProfessionPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Abreviación", value: "abreviacion" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
