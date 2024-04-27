<template lang="pug">
div
  pagination(
    title="Rol de Turnos",
    model="shift-work/review",
    :headers="headers",
    :after="after",
    :item-class="swClass",
    no-action,
  )
    template(v-slot:header-end)
      v-btn.mr-3(
        filled,
        color="primary",
        :loading="loading",
        @click="printShiftWork({id: '*',type: 'Regular'})"
      ) Reporte
    template(v-slot:actions="{ item }")
      v-icon(small, @click="$router.push(`/shift-work/view/${item.id}`)") mdi-eye
      v-btn.ml-2(
        v-if="item.estado === 'Aprobado'",
        @click="printShiftWork(item)",
        :loading="item.loading",
        small,
        icon
      )
        v-icon(small) mdi-printer
      v-tooltip(v-if="item.estado === 'Observado'", top)
        template(v-slot:activator="{ on, attrs }")
          v-icon.ml-2(v-on="on", v-bind="attrs", small, color="#AB9F0C") mdi-alert-circle
        span
          b Observación:
          br
          | {{ item.observacion }}
  pagination(
    title="Horas Complementarias",
    model="shift-work/review",
    :headers="headers",
    :params="{ type: 'Complementario' }",
    :after="after",
    :item-class="swClass",
    no-action,
  )
    template(v-slot:header-end)
      v-btn.mr-3(
        filled,
        color="primary",
        :loading="loadingComplementary",
        @click="printShiftWork({id: '*',type: 'Complementario'})"
      ) Reporte
    template(v-slot:actions="{ item }")
      v-icon(small, @click="$router.push(`/shift-work/view/${item.id}`)") mdi-eye
      v-btn.ml-2(
        v-if="item.estado === 'Aprobado'",
        @click="printShiftWork(item)",
        :loading="item.loading",
        small,
        icon
      )
        v-icon(small) mdi-printer
      v-tooltip(v-if="item.estado === 'Observado'", top)
        template(v-slot:activator="{ on, attrs }")
          v-icon.ml-2(v-on="on", v-bind="attrs", small, color="#AB9F0C") mdi-alert-circle
        span
          b Observación:
          br
          | {{ item.observacion }}
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { RolTurno } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Rol de Turnos" };
  },
})
export default class ShiftWorkPage extends Vue {
  // a = [{ text: "ID", value: "id" }];

  printPayload: any = null;
  loading = false;
  loadingComplementary = false;
  checkPrint = false;

  headers: any = [
    // ...this.a,
    { text: "ID", value: "id", width: 75, align: "left" },
    {
      text: "Estructura Orgánica",
      value: "estructuraOrganica",
      width: 400,
      align: "left",
    },
    { text: "Mes", value: "mes", align: "left" },
    { text: "Año", value: "anio", align: "left" },
    { text: "Responsable", value: "responsable", align: "left" },
    { text: "Fecha", value: "fecha", align: "left" },
    { text: "Estado", value: "estado", align: "left" },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];

  after(sw: Required<RolTurno>) {
    const now = new Date(sw.anio, (sw.mes as number) - 1);
    const month = now.toLocaleString("es-es", {
      month: "long",
    });
    sw.mes = month.charAt(0).toUpperCase() + month.slice(1);
    (sw as any).loading = false;
    (sw as any).fecha = new Date(sw.fechaMod ?? sw.fechaReg).toLocaleString(
      "es-es",
    );
  }

  swClass(item: any) {
    if (item.estado === "Enviado") {
      return "item-enviado";
    } else if (item.estado === "Observado") {
      return "item-observado";
    }
    return undefined;
  }

  printShiftWork(sw: any) {
    if (sw?.loading !== undefined) {
      sw.loading = true;
    } else {
      this.loading = true;
    }
    this.$axios.buildResponse<any>({
      attempts: 1,
      request: {
        method: "GET",
        url: this.checkPrint
          ? `/api/shift-work/${sw.id}/print?type=${sw.type}`
          : `/api/common/shift-work/${sw.id}/print`,
      },
      ifOk: ({ payload }) => {
        window.open(payload.url, "_blank");
      },
      finally: () => {
        if (sw?.loading !== undefined) {
          sw.loading = false;
        } else {
          this.loading = false;
        }
      },
    });
  }

  mounted() {
    this.$axios.buildResponse<boolean>({
      request: `/api/common/shift-work/check-print`,
      ifOk: ({ payload }) => {
        this.checkPrint = payload;
      },
    });
  }
}
</script>

<style>
.item-parcial {
  background-color: #96db8d;
}
.item-enviado {
  background-color: #aed0f3;
}
.item-observado {
  background-color: #eef7bb;
}
</style>
