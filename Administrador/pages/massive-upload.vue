<template lang="pug">
v-row(fluid, justify="center", no-gutters)
  v-col(cols=12, md=6)
    card(title="Carga masiva de datos INFORHUS")
      v-form.mt-8(ref="uploadInforhusForm")
        v-file-input(
          v-model="excelInforhusFile",
          :rules="requiredRule",
          filled,
          label="Archivo"
        )
      template(v-slot:header-end)
        v-btn(
          :loading="isInforhusUploading",
          @click="Upload(false)",
          color="primary"
        ) Cargar datos

    card(title="Carga masiva de datos PLANILLA")
      v-form.mt-8(ref="uploadPayrollForm")
        v-file-input(
          v-model="excelPayrollFile",
          :rules="requiredRule",
          filled,
          label="Archivo"
        )
                  
      template(v-slot:header-end)
        v-btn(
          :loading="isPayrollUploading",
          @click="Upload(true)",
          color="primary"
        ) Cargar datos
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Carga masiva" };
  },
})
export default class UploadPage extends Vue {
  @Ref()
  readonly uploadInforhusForm!: HTMLFormElement;

  @Ref()
  readonly uploadPayrollForm!: HTMLFormElement;

  isInforhusUploading: boolean = false;
  isPayrollUploading: boolean = false;
  excelInforhusFile: any = null;
  excelPayrollFile: any = null;
  date: string = new Date().toISOString().substr(0, 7);
  menu: boolean = false;
  modal: boolean = false;

  async Upload(isPayroll: boolean) {
    if (
      isPayroll
        ? this.uploadPayrollForm.validate()
        : this.uploadInforhusForm.validate()
    ) {
      const formData = new FormData();

      if (isPayroll) {
        this.isPayrollUploading = true;
        //const splitted = this.formattedDate.split("-");
        //formData.append("year", splitted[1]);
        //formData.append("month", splitted[0]);
        formData.append("document", this.excelPayrollFile);
      } else {
        this.isInforhusUploading = true;
        formData.append("document", this.excelInforhusFile);
      }
      await this.$axios.buildResponse({
        attempts: 1,
        notify: "always",
        request: {
          url: `/api/upload/upload-document`,
          method: "POST",
          headers: { "Content-Type": "multipart/form-data" },
          data: formData,
        },
        finally: () => {
          if (isPayroll) {
            this.isPayrollUploading = false;
          } else {
            this.isInforhusUploading = false;
          }
        },
      });
    }
  }

  get formattedDate() {
    return this.date.split("-").reverse().join("-");
  }
}
</script>

<style>
.r__v-container {
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #eee !important;
}
.r__v-card {
  min-width: 400px;
  max-width: 500px;
}

@media only screen and (max-width: 600px) {
  .r__v-card {
    width: 90vw;
    min-width: unset;
    max-height: 90vh;
  }
}
</style>
