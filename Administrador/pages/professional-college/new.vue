<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(
      color="primary",
      :loading="isLoading",
      @click="createProfessionalCollege"
    ) Guardar
  v-form.text-center(ref="newProfessionalCollegeForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="professionalCollege.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="professionalCollege.decano",
          label="Decano",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="professionalCollege.direccion",
          :rules="requiredRule",
          label="Direccion",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="professionalCollege.telefonos",
          label="Teléfonos",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="professionalCollege.sitioWeb",
          label="Sitio Web",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(v-model="professionalCollege.foto", label="Foto", filled) 
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { ColegioProfesional } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Colegio Profesional" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newProfessionalCollegeForm!: HTMLFormElement;

  isLoading: boolean = false;

  professionalCollege: Partial<ColegioProfesional> = {};

  async createProfessionalCollege() {
    if (this.newProfessionalCollegeForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/professional-college",
          data: this.professionalCollege,
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
