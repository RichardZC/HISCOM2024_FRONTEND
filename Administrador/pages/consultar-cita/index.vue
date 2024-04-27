<template lang="pug">
v-container.fill-height.fill-width(
  fluid,
  style="background-color: #eee !important"
)
  v-card.pa-4.mx-auto
    v-form(@submit.prevent, ref="consultAppointmentForm")
      v-row(justify="center")
        v-col.text-center(cols=12)
          .mb-2(style="font-size: 22px; font-weight: 500") CONSULTA TU CITA
          v-divider
        v-col.mb-0(cols=12, xs=12,md=6)
          v-text-field.m-0(
            v-model="dni",
            :rules="requiredRule",
            filled,
            label="Dni"
            maxlength="8"
            counter
            v-on:keyup.enter="UspConsultAppointment"
          )
        v-col.text-center(cols=12)
          v-btn(
            :loading="isSearching",
            @click="UspConsultAppointment",
            color="primary"
          ) Consultar
          
          v-alert.mt-2(type="info", v-if="isMessage") Citas pendientes no encontradas!
  v-card.mx-auto(v-if="appointments.length > 0")
    v-row(justify="center")
      v-col(cols=12)          
        v-data-table(
          :headers="headers",
          :items="appointments",
          :items-per-page="5"
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";

declare const grecaptcha: any;

@Component({
  auth: false,
  // Head configuration.
  head() {
    return { title: "Buscar" };
  },
})
export default class SearchSWPage extends Vue {
  @Ref()
  readonly consultAppointmentForm!: HTMLFormElement;

  dni: string = "";
  appointments: {}[] = [];

  isSearching: boolean = false;
  isMessage: boolean = false;

  headers: any = [
    { text: "Documento", value: "documento",sortable: false },
    { text: "Paciente", value: "paciente",sortable: false },
    { text: "Fecha Cita", value: "fechaCita",sortable: false },
    { text: "Hora Cita", value: "horaCita",sortable: false },
    { text: "Servicio", value: "servicio",sortable: false },
    { text: "Profesional", value: "profesional",sortable: false },
    { text: "Fuente Financiamiento", value: "fuenteFinanciamiento",sortable: false },
    { text: "Estado", value: "estado",sortable: false },
  ];

  UspConsultAppointment() {
    if (this.consultAppointmentForm.validate()) {
      grecaptcha.ready(async () => {
        const token = await grecaptcha.execute(this.$config.captchaKey, {
          action: "submit",
        });

        this.isSearching = true;
        await this.$axios.buildResponse<any>({
          paginated: false,
          notify: false,
          request: {
            method: "GET",
            url: `/api/public/consult-appointment?dni=${this.dni}&token=${token}`,
          },
          ifOk: ({ payload }) => {
            this.appointments = payload;            
            if(payload.length > 0){
              this.isMessage=false
            }
            else
              this.isMessage=true
          },
          finally: () => {
            this.isSearching = false;
          },
        });
      });
    }
  }

  mounted() {
    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      `https://www.google.com/recaptcha/api.js?render=${this.$config.captchaKey}`,
    );
    document.head.appendChild(recaptchaScript);
  }
}
</script>

<style></style>
