<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(
      depressed,
      color="primary",
      :loading="isLoading",
      @click="updateBank"
    ) Guardar
  v-form.text-center(ref="editBankForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="bank.nombre",
          :rules="requiredRule",
          label="Denominacion",
          required,
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="bank.abreviacion",
          :rules="requiredRule",
          label="Abreviación",
          required,
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
  readonly editBankForm!: HTMLFormElement;

  isLoading: boolean = false;

  bank: Partial<Banco> = {};

  async updateBank() {
    if (this.editBankForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/bank/${this.$route.params.id}`,
          data: this.bank,
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
        this.$axios.getResponse<Banco>({
          request: {
            method: "GET",
            url: `/api/bank/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.bank = result[0];
      },
    });
  }
}
</script>
