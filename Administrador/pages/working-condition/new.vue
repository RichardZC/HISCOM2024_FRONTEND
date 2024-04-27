<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="createContractType", color="primary") Guardar
  v-form.text-center(ref="newContractTypeForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="contractType.id",
          :rules="requiredRule",
          filled,
          label="Código"
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="contractType.denominacion",
          :rules="requiredRule",
          filled,
          label="Denominacion"
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { CondicionLaboral } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Tipo de Contrato" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newContractTypeForm!: HTMLFormElement;

  isLoading: boolean = false;

  contractType: Partial<CondicionLaboral> = {};

  async createContractType() {
    if (this.newContractTypeForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/working-condition",
          data: this.contractType,
        },
        ifOk: () => {
          this.$router.replace("/master");
        },
      });
      this.isLoading = false;
    }
  }
}
</script>
