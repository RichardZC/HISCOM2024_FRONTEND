<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(
      color="primary",
      :loading="isLoading",
      @click="editProfessionalCollege"
    ) Guardar
  v-form.text-center(ref="editProfessionalCollegeForm")
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
    return { title: "Editar Colegio Profesional" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editProfessionalCollegeForm!: HTMLFormElement;

  isLoading: boolean = false;

  professionalCollege: Partial<ColegioProfesional> = {};

  async editProfessionalCollege() {
    if (this.editProfessionalCollegeForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/professional-college/${this.$route.params.id}`,
          data: this.professionalCollege,
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
        this.$axios.getResponse<ColegioProfesional>({
          request: {
            method: "GET",
            url: `/api/professional-college/${this.$route.params.id}`,
            data: this.professionalCollege,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.professionalCollege = result[0];
      },
    });
  }
}
</script>
