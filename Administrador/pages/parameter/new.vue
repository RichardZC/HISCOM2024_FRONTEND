<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="createParameter", color="primary") Guardar
  v-form.text-center(ref="newParameterForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="parameter.llave",
          :rules="requiredRule",
          filled,
          label="Llave"
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="parameter.valor",
          :rules="requiredRule",
          filled,
          label="Valor"
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Parametro } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Parámetro" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newParameterForm!: HTMLFormElement;

  isLoading: boolean = false;

  parameter: Partial<Parametro> = {};

  async createParameter() {
    if (this.newParameterForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/parameter",
          data: this.parameter,
        },
        ifOk: () => {
          this.$router.replace("/parameter");
        },
      });
      this.isLoading = false;
    }
  }
}
</script>
