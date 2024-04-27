<template lang="pug">
v-container.r__v-container.d-flex.justify-center.align-center(fluid)
  v-snackbar(v-model="snackbar", color="primary", dark) 
    v-icon.mr-2 mdi-alert
    | {{ errorMessage }}
    template(v-slot:action="{ attrs }")
      v-btn(v-bind="attrs", @click="snackbar = false", dark, text) Cerrar
  v-card.r__v-card.pa-0.text-center.mx-0(v-if="isLogin") 
    v-toolbar(color="primary", dark) 
      v-toolbar-title Búsqueda de exámenes
    v-form.pa-6(ref="loginExamForm")
      v-text-field(
        v-model="loginPayload.dni",
        :rules="requiredRule",
        filled,
        label="DNI"
      )
      v-menu(
        v-model="issueDateMenu",
        :close-on-content-click="false",
        :nudge-right="40",
        min-width="auto",
        offset-y,
        transition="scale-transition"
      )
        template(v-slot:activator="{ on, attrs }")
          v-text-field.pb-0(
            v-bind="attrs",
            v-model="issueDateFormatted",
            v-on="on",
            :rules="requiredRule",
            filled,
            label="Fecha de emisión",
            prepend-icon="mdi-calendar"
          )
        v-date-picker(
          v-model="loginPayload.issueDate",
          @input="issueDateMenu = false"
        )
      v-btn(:loading="isLoading", @click="login", color="primary") Ingresar
  pagination(
    v-else,
    :after="after",
    :headers="headers",
    :params="{ apiKey: apiKey, dni: loginPayload.dni }",
    model="public/patient/exams",
    no-action,
    style="width: 75%",
    title="Lista de exámenes"
  )
    template(v-slot:actions="{ item }")
      v-btn.ml-2(
        v-for="(pdf, idx) in item.examenes",
        :key="idx",
        :loading="item.loading",
        @click="openPdf(pdf)",
        icon,
        small
      )
        v-icon(small) mdi-printer
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from "nuxt-property-decorator";

@Component({
  auth: false,
  // Head configuration.
  head() {
    return { title: "Buscar" };
  },
})
export default class SearchSWPage extends Vue {
  @Ref()
  readonly loginExamForm!: HTMLFormElement;

  headers: any = [
    { text: "ID", value: "id", sortable: false },
    { text: "DNI", value: "dniPaciente", sortable: false },
    { text: "Categoría", value: "categoriaId", sortable: false },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];

  isLogin: boolean = true;
  isLoading: boolean = false;

  loginPayload = {
    dni: "",
    issueDate: "",
  };

  issueDateMenu: boolean = false;
  issueDateFormatted: string = "";

  snackbar: boolean = false;
  errorMessage: string = "Los datos son inválidos";

  apiKey: string | null = null;

  @Watch("loginPayload.issueDate")
  onBirthDayChange(val: string) {
    if (!val) {
      return;
    }
    const [year, month, day] = val.split("-");
    this.issueDateFormatted = `${day}/${month}/${year}`;
  }

  after(item: any) {
    item.examenes = item.examenPdf.split(",");
  }

  openPdf(pdf: string) {
    window.open(pdf, "_blank");
  }

  async login() {
    if (this.loginExamForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse<string>({
        request: {
          method: "POST",
          url: "api/public/patient/login",
          data: {
            dni: this.loginPayload.dni,
            issueDate: this.loginPayload.issueDate,
          },
        },

        ifOk: ({ payload }) => {
          this.apiKey = payload;
          this.isLogin = false;
        },
      });

      this.isLoading = false;
    }
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
