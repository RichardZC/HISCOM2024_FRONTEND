<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(
      color="primary",
      :loading="isLoading",
      @click="createBank"
    ) Guardar
  v-form.text-center(ref="newBankForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="bank.nombre",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="bank.abreviacion",
          label="Abreviación",
          filled
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Banco } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Banco" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newBankForm!: HTMLFormElement;

  isLoading: boolean = false;

  bank: Partial<Banco> = {};

  async createBank() {
    if (this.newBankForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/bank",
          data: this.bank,
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
