<template lang="pug">
div
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Exámenes clínicos" };
  },
})
export default class ShiftWorkPage extends Vue {
  // a = [{ text: "ID", value: "id" }];

  headers: any = [
    // ...this.a,
    { text: "ID", value: "id", width: 75 },
    { text: "Categoria", value: "categoria" },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];
}
</script>
