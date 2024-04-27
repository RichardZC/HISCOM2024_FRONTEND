<template lang="pug">
v-container.fill-height.fill-width(
  fluid,
  style="background-color: #eee !important"
)
  v-skeleton-loader(v-if="!profile")
  v-card.pa-8.mx-auto(v-else, style="max-width: 1500px")
    v-row.mb-3
      v-col(cols=6, xs=12, sm=6, md=4 )
        img(
          src="https://hrayacucho.gob.pe/images/logo.png",
          style="height: 80px; width: auto"
        )        
      v-col.hidden-sm-and-down(cols=6, xs=2, sm=2, md=4)
        .text-center.mt-2(style="font-size: 16px") HOSPITAL REGIONAL "MIGUEL ÁNGEL MARISCAL LLERENA" DE AYACUCHO
          br 
          b PERSONAL
      v-col.text-right(cols=6, xs=12, sm=6, md=4)
        img(
          :src="`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${currentUrl}`"
        )
    v-row(justify="center")
      v-col.d-flex.justify-center(cols=12, md=4)
        .text-center
          v-img(
            :src="profile.foto ? profile.foto : require('~/assets/employees/user-placeholder.png')",
            max-height="300",
            max-width="350"
          )
          .pt-3
            span {{ profile.nombreCompleto }}
            br
            span {{ profile.cargo }}
            br
            span {{ profile.organigrama }}
      v-col(cols=12, md=8) 
        v-row.pa-3
          v-col(cols=12, md=6)
            v-text-field(v-model="profile.numeroDoc", label="DNI", readonly)
          v-col(cols=12, md=6)
            v-text-field(
              v-model="profile.nombreCompleto",
              label="Apellidos y Nombres",
              readonly
            )
          v-col(cols=12, md=6)
            v-text-field(v-model="profile.correo", label="Correo", readonly)
          v-col(cols=12, md=6)
            v-text-field(
              v-model="profile.profesion",
              label="Profesión",
              readonly
            )
          v-col(cols=12, md=6)
            v-text-field(
              v-model="profile.condicionLaboral",
              label="Condicion Laboral",
              readonly
            )
          v-col(cols=12, md=6)
            v-text-field(
              v-model="profile.fechaIngreso",
              label="Fecha Ingreso",
              readonly
            )
          v-col(cols=12, md=6)
            v-text-field(
              v-model="profile.colegioProfesional",
              label="Colegio Profesional",
              readonly
            )
          v-col(cols=12, md=6)
            v-text-field(
              v-model="profile.colegioProfesionalNro",
              label="Nro Colegio Profesional",
              readonly
            )
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "default",
  auth: false,
  // Head configuration.
  head() {
    return { title: "Personal" };
  },
})
export default class PersonalPage extends Vue {
  profile: any = null;

  currentUrl: any = window.location.href;

  mounted() {
    this.$axios.buildResponse({
      notify: "always",
      attempts: 1,
      request: {
        method: "GET",
        url: `/api/public/personal/${this.$route.params.id}`,
      },
      ifOk: (res) => {
        // console.log(res)
        this.profile = res.payload;
        // this.$router.replace("/employee");
      },
      ifErr: () => {
        this.$nuxt.error({ statusCode: 404, message: "err message" });
      },
    });
  }
}

/* export default {
  auth: false,
  data() {
    return {
      profile: null,
    };
  },
  validate(item) {
    return /^\d+$/.test(item.params.id); // solo numeros
  },
  mounted() {
    this.$axios.buildResponse({
      notify: "always",
      attempts: 1,
      request: {
        method: "GET",
        url: `/api/public/personal/${this.$route.params.id}`,
      },
      ifOk: (res) => {
        // console.log(res)
        this.profile = res.payload;
        // this.$router.replace("/employee");
      },
    });
  },
}; */
</script>
