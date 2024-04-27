<template lang="pug">
div
  v-snackbar(v-model="snackbar", color="primary", dark) 
    v-icon.mr-2 mdi-alert
    | {{ errorMessage }}
    template(v-slot:action="{ attrs }")
      v-btn(v-bind="attrs", @click="snackbar = false", dark, text) Cerrar
  v-container.r__v-container.d-flex.justify-center.align-center(fluid)
    v-card.r__v-card.pa-0.text-center.mx-0
      v-toolbar(color="primary", dark) 
        v-toolbar-title Búsqueda de archivos
      v-form.pa-6(ref="searchForm")
        v-text-field(
          v-model="codePdf",
          :rules="requiredRule",
          @keyup.enter="SearchSW",
          append-icon="mdi-file",
          filled,
          label="Código"
        )
        v-btn(:loading="isSearching", @click="SearchSW", color="primary") Buscar
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";

@Component({
  auth: false,
  // Head configuration.
  head() {
    return { title: "Buscar" };
  },
})
export default class SearchSWPage extends Vue {
  @Ref()
  readonly searchForm!: HTMLFormElement;

  isSearching: boolean = false;
  codePdf: string = "";
  rollBackPdf: string = "";

  snackbar: boolean = false;
  errorMessage: string = "El archivo no se encuentra o aún no ha sido generado";

  async SearchSW() {
    if (this.searchForm.validate()) {
      this.isSearching = true;
      await this.$axios.buildResponse({
        notify: false,
        request: {
          url: `/api/public/search/${this.codePdf}`,
          method: "GET",
        },

        ifOk: ({ payload }) => {
          window.open(payload.url, "_blank");
        },
        ifErr: () => {
          this.snackbar = true;
        },
        finally: () => {
          this.isSearching = false;
        },
      });
    }
  }
}
</script>

<style>
.r__v-container {
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #eee !important;
}
.r__v-card {
  min-width: 400px;
  max-width: 500px;
}

@media only screen and (max-width: 600px) {
  .r__v-card {
    width: 90vw;
    min-width: unset;
    max-height: 90vh;
  }
}
</style>
