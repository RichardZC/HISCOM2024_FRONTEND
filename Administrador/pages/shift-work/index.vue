<template lang="pug">
div
  pagination(
    :after="after",
    :headers="headers",
    model="shift-work/history",
    no-action,
    title="Histórico Rol de Turnos"
  )
    template(v-slot:actions="{ item }")
      v-icon(@click="$router.push(`/shift-work/view/${item.id}`)", small) mdi-eye
      v-btn.ml-2(
        :loading="item.loading",
        @click="printShiftWork(item)",
        icon,
        small
      )
        v-icon(small) mdi-printer
      v-tooltip(top)
        template(v-slot:activator="{ on, attrs }")
          v-btn.ml-2(
            v-bind="attrs",
            v-on="on",
            :loading="item.loadingConsolidated",
            @click="printConsolidatedShiftWork(item)",
            icon,
            small
          )
            v-icon(small) mdi-file
        span Imprimir consolidado
  pagination(
    :after="after",
    :headers="headers",
    :params="{ type: 'Complementario' }",
    model="shift-work/history",
    no-action,
    title="Histórico Horas Complementarias"
  )
    template(v-slot:actions="{ item }")
      v-icon(@click="$router.push(`/shift-work/view/${item.id}`)", small) mdi-eye
      v-btn.ml-2(
        :loading="item.loading",
        @click="printShiftWork(item)",
        icon,
        small
      )
        v-icon(small) mdi-printer
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

  headers: any = [
    // ...this.a,
    { text: "ID", value: "id", width: 75 },
    {
      text: "Estructura Orgánica",
      value: "organigrama.denominacion",
      width: 400,
    },
    { text: "Mes", value: "mes" },
    { text: "Año", value: "anio" },
    { text: "Responsable", value: "jefe.nombreCompleto" },
    { text: "Fecha", value: "fecha" },
    { text: "Estado", value: "estado" },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];

  after(sw: Required<RolTurno>) {
    const now = new Date(sw.anio, (sw.mes as number) - 1);
    const month = now.toLocaleString("es-es", {
      month: "long",
    });
    sw.mes = month.toUpperCase();

    (sw as any).loading = false;
    (sw as any).loadingConsolidated = false;
    (
      sw as any
    ).jefe.nombreCompleto = `${sw.jefe.apellidoPaterno} ${sw.jefe.apellidoMaterno} ${sw.jefe.nombres}`;
    (sw as any).fecha = new Date(sw.fechaMod ?? sw.fechaReg).toLocaleString(
      "es-es",
    );
  }

  printShiftWork(sw: any) {
    sw.loading = true;
    this.$axios.buildResponse<any>({
      attempts: 1,
      request: {
        method: "GET",
        url: `/api/common/shift-work/${sw.id}/print`,
      },
      ifOk: ({ payload }) => {
        window.open(payload.url, "_blank");
      },
      finally: () => {
        sw.loading = false;
      },
    });
  }

  printConsolidatedShiftWork(sw: any) {
    sw.loadingConsolidated = true;
    this.$axios.buildResponse<any>({
      attempts: 1,
      request: {
        method: "GET",
        url: `/api/common/shift-work/${sw.id}/print-consolidated`,
      },
      ifOk: ({ payload }) => {
        window.open(payload.url, "_blank");
      },
      finally: () => {
        sw.loadingConsolidated = false;
      },
    });
  }
}
</script>
