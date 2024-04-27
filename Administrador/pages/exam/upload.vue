<template lang="pug">
card(title="Agregar")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="uploadPdf", color="primary") Guardar
  v-form.text-center(ref="newExamForm")
    v-row
      v-col(cols=12, md=6)
        v-autocomplete(
          v-model="exams.dniPaciente",
          :filter="() => true",
          :items="dniItems",
          :loading="dniLoading",
          :rules="requiredRule",
          :search-input.sync="dniSearch",
          filled,
          hide-no-data
          hide-selected
          label="DNI del paciente*",
          placeholder="Digita el DNI para buscar"
          prepend-icon="mdi-database-search"
          return-object
        )
    v-row(justify="center", no-gutters)
      v-col(cols=12, md=6)
        v-text-field(
          v-model="exams.categoriaId",
          :rules="requiredRule",
          filled,
          label="Categoría*"
        )
      v-col(cols=12, md=6)
        v-file-input(
          v-model="exams.examenPdf",
          :rules="requiredRule",
          accept=".pdf",
          filled,
          label="Archivos*",
          multiple
        )
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from "nuxt-property-decorator";
import { ExamenClinico } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Exámenes clínicos" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newExamForm!: HTMLFormElement;

  searchTimeout?: NodeJS.Timeout = undefined;

  dni: string = "";
  dniSearch: string = "";
  dniItems: any[] = [];
  dniLoading: boolean = false;

  @Watch("dniSearch")
  onSearchChange(input: string | null) {
    if (!input || input?.length!=8) {
      return;
    }
    
    this.dni = "";

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.dniLoading = true;
    this.searchTimeout = setTimeout(async () => {
      try {
        const { data } = await this.$axios.get(`/api/public/dni/${input}`);
        if(data){
          this.dniItems = [data.nombreCompleto];
          this.dni = input;
        }
        else{
          this.dni = "";
        }
      } finally {
        this.dniLoading = false;
      }
    }, 750);
  }

  isLoading: boolean = false;
  exams: ExamenClinico = {} as ExamenClinico;

  async uploadPdf() {
    if (this.newExamForm.validate()) {
      this.isLoading = true;

      const form = new FormData();
      form.append("Dni", this.dni);
      form.append("Category", this.exams.categoriaId);

      for (const file of this.exams.examenPdf) {
        form.append("Exams", file);
      }

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/upload/upload-exam",
          data: form,
        },
      });

      this.isLoading = false;
    }
  }
}
</script>
