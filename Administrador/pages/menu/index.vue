<template lang="pug">
pagination(title="Lista de Menus", :headers="headers", model="menu")
  template(v-slot:item.icono="{ item }")
    v-icon {{ item.icono }}
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Menus" };
  },
})
export default class MenuPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Nombre", value: "nombre" },
    { text: "Icono", value: "icono" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
