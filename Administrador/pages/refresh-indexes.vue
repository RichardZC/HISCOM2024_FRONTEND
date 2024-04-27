<template lang="pug">
v-row(fluid, no-gutters, justify="center")
  v-col(cols=12, md=6)
    card(title="Indexación HISCOM")
      v-form.mt-8(ref="indexForm")
        v-select(
          v-model="indexes",
          :items="entries"
          :rules="requiredRule",
          :disabled="indexAll"
          label="Índice",
          multiple,
          persistent-hint,
          filled
        )
        v-checkbox(v-model="indexAll", label="Todas las entidades")

      template(v-slot:header-end)
        v-btn(color="primary", :loading="isIndexing", @click="RefreshIndexes") Refrescar indices

</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Indexación" };
  },
})
export default class IndexationPage extends Vue {
  @Ref()
  readonly indexForm!: HTMLFormElement;

  isIndexing: boolean = false;
  indexes: string[] = [];
  entries: string[] = [];
  indexAll: boolean = false;

  async RefreshIndexes() {
    if (this.indexAll || this.indexForm.validate()) {
      this.isIndexing = true;

      const query = this.indexAll ? "*" : this.indexes.join(",");

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          url: `/api/indexation/refresh-indexes?indexes=${query}`,
          method: "GET",
        },
      });
      this.isIndexing = false;
    }
  }

  mounted() {
    this.$axios.buildResponse({
      request: "/api/indexation",
      ifOk: ({ payload }) => {
        this.entries = payload;
      },
    });
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
