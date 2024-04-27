<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(
      depressed,
      color="primary",
      :loading="isLoading",
      @click="updateConceptoPlanilla"
    ) Guardar
  v-form.text-center(ref="editConceptoPlanillaForm")
    v-row
      v-col(cols=12, md=6)
        v-text-field(
          v-model="conceptoPlanilla.codigo",
          label="Codigo",
          readonly,
          filled
        )    
      v-col(cols=12, md=6)
        v-text-field(
          v-model="conceptoPlanilla.denominacion",          
          label="Denominacion",          
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="conceptoPlanilla.abreviado",
          :rules="requiredRule",
          label="Abreviatura",
          required,
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="conceptoPlanilla.tipo",
          label="Tipo",
          filled
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { ConceptoPlanilla } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Editar Concepto Planilla" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editConceptoPlanillaForm!: HTMLFormElement;

  isLoading: boolean = false;
  conceptoPlanilla: Partial<ConceptoPlanilla> = {};

  async updateConceptoPlanilla() {
    if (this.editConceptoPlanillaForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/concepto-planilla/${this.$route.params.id}`,
          data: this.conceptoPlanilla,
        },
        ifOk: () => {
          this.$router.replace("/master");
        },
      });
      this.isLoading = false;
    }
  }

  mounted() {
    const self = this;
    this.$axios.buildResponses<any>({
      requests: [
        this.$axios.getResponse<ConceptoPlanilla>({
          request: {
            method: "GET",
            url: `/api/concepto-Planilla/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.conceptoPlanilla = result[0];
        self.conceptoPlanilla.tipo = self.conceptoPlanilla.indNombrado?"NOMBRADO":"CONTRATADO"
      },
    });
  }
}
</script>

