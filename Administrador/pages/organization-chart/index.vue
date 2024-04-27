<template lang="pug">
pagination(
  title="Estructuras Orgánicas",
  :get-page="getPage",
  :headers="headers",
  model="organization-chart"
)
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Organigrama" };
  },
})
export default class LevelPage extends Vue {
  headers: any = [
    { text: "ID", value: "id" },
    { text: "Nombre", value: "nombre" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
