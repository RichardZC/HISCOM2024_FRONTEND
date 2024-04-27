<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="updateProfession", color="primary") Guardar
  v-form.text-center(ref="editProfessionForm")
    v-row
      v-col(cols=12, md=6)
        v-text-field(
          v-model="profession.id",
          :rules="requiredRule",
          filled,
          label="Código"
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="profession.abreviacion",
          filled,
          label="Abreviación"
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="profession.denominacion",
          :rules="requiredRule",
          filled,
          label="Denominacion"
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Profesion } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Editar Profesión" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editProfessionForm!: HTMLFormElement;

  isLoading: boolean = false;

  profession: Profesion = {
    abreviacion: "",
    denominacion: "",
  };

  async updateProfession() {
    if (this.editProfessionForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/profession/${this.$route.params.id}`,
          data: this.profession,
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
        this.$axios.getResponse<Profesion>({
          request: {
            method: "GET",
            url: `/api/profession/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.profession = result[0];
      },
    });
  }
}
</script>
