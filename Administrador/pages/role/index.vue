<template lang="pug">
pagination(title="Lista de roles", :headers="headers", model="role")
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Roles" };
  },
})
export default class RolPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Rol", value: "denominacion" },
    { text: "Descripcion", value: "descripcion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
