<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="updateParameter") Guardar
  v-form.text-center(ref="editParameterForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="parameter.llave",
          :rules="requiredRule",
          label="Llave",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="parameter.valor",
          :rules="requiredRule",
          label="Valor",
          filled
        ) 
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Parametro } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Editar Parámetro" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editParameterForm!: HTMLFormElement;

  isLoading: boolean = false;

  parameter: Partial<Parametro> = {};

  async updateParameter() {
    if (this.editParameterForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/parameter/${this.$route.params.id}`,
          data: this.parameter,
        },
        ifOk: () => {
          this.$router.replace("/parameter");
        },
      });
      this.isLoading = false;
    }
  }

  mounted() {
    const self = this;
    this.$axios.buildResponses<any>({
      requests: [
        this.$axios.getResponse<Parametro>({
          request: {
            method: "GET",
            url: `/api/parameter/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.parameter = result[0];
      },
    });
  }
}
</script>
