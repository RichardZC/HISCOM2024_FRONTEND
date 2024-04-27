<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="createProfession", color="primary") Guardar
  v-form.text-center(ref="newProfessionForm")
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
    return { title: "Nueva Profesión" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newProfessionForm!: HTMLFormElement;

  isLoading: boolean = false;

  profession: Profesion = {
    abreviacion: "",
    denominacion: "",
  };

  async createProfession() {
    if (this.newProfessionForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/profession",
          data: this.profession,
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
