<template lang="pug">
pagination(title="Lista de Permisos", :headers="headers", model="permission")
  template(v-slot:item.visible="{ item }")
    v-simple-checkbox(:value="item.visible", disabled)
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  head() {
    return { title: "Permisos" };
  },
})
export default class PermisoPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Menu", value: "menu" },
    { text: "Accion", value: "accion" },
    { text: "Ruta", value: "ruta" },
    { text: "Nombre", value: "nombre" },
    { text: "Visible", value: "visible" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
