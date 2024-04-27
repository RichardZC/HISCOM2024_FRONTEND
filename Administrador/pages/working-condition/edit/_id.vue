<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(
      :loading="isLoading",
      @click="updateContractType",
      color="primary",
      depressed
    ) Guardar
  v-form.text-center(ref="editContractTypeForm")
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
          label="Denominacion",
          required
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { CondicionLaboral } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Tipo de Contrato" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editContractTypeForm!: HTMLFormElement;

  isLoading: boolean = false;

  contractType: Partial<CondicionLaboral> = {};

  async updateContractType() {
    if (this.editContractTypeForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/working-condition/${this.$route.params.id}`,
          data: this.contractType,
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
        this.$axios.getResponse<CondicionLaboral>({
          request: {
            method: "GET",
            url: `/api/working-condition/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.contractType = result[0];
      },
    });
  }
}
</script>
