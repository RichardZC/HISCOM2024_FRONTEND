<template lang="pug">
v-row
  v-col(cols=12, md=6)
    pagination(
      :after="after",
      :headers="headers",
      model="marking/periods",
      no-action,
      no-search,
      title="Mis Marcaciones"
    )
      template(v-slot:actions="{ item }")
        v-btn.ml-2(
          :loading="item.loading",
          @click="checkDays(item)",
          icon,
          small
        )
          v-icon(small) mdi-eye
  v-col(v-if="period.month && period.year", cols=12, md=6)
    pagination(
      :after="afterDays",
      :headers="headersDays",
      :model="modelDays",
      no-action,
      no-search,
      title="Registros de Marcaciones"
    )
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Marcaciones" };
  },
})
export default class PayrollPage extends Vue {
  // a = [{ text: "ID", value: "id" }];

  printPayload: any = null;
  period: any = {};

  headers: any = [
    { text: "Año", value: "year" },
    { text: "Mes", value: "monthString" },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];

  headersDays: any = [
    { text: "Id", value: "id" },
    { text: "Fecha", value: "date" },
    { text: "Hora", value: "time" },
  ];

  after(item: any) {
    item.loading = false;
    const now = new Date(item.year, (item.month as number) - 1);
    const month = now.toLocaleString("es-es", {
      month: "long",
    });
    item.monthString = month.charAt(0).toUpperCase() + month.slice(1);
  }

  afterDays(item: any) {
    const [date, time] = item.fecha.split("T");
    item.time = time;

    const [year, month, day] = date.split("-");
    item.date = `${day}/${month}/${year}`;
  }

  checkDays(item: any) {
    this.period = { month: item.month, year: item.year };
  }

  get modelDays() {
    return `marking/days?year=${this.period.year}&month=${this.period.month}`;
  }
}
</script>
