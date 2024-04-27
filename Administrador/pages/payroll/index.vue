<template lang="pug">
v-row
  v-col(cols=12)
    pagination(
      :after="(item) => (item.loading = false)",
      :headers="headers",
      model="payroll",
      no-action,
      no-search,
      title="Boletas de Pago"
    )
      template(v-slot:actions="{ item }")
        v-btn.ml-2(
          :loading="item.loading",
          @click="printPayroll(item)",
          icon,
          small
        )
          v-icon(small) mdi-printer
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Boletas de pago" };
  },
})
export default class PayrollPage extends Vue {
  // a = [{ text: "ID", value: "id" }];

  printPayload: any = null;

  headers: any = [
    // ...this.a,
    { text: "Id", value: "id" },
    { text: "Tipo", value: "type" },
    { text: "Periodo", value: "period" },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];

  printPayroll(item: any) {
    item.loading = true;
    const [month, year] = item.period.split("-");

    this.$axios.buildResponse<any>({
      attempts: 1,
      request: {
        method: "GET",
        url: `/api/common/payroll/print?year=${year}&month=${month}`,
      },
      ifOk: ({ payload }) => {
        window.open(payload.url, "_blank");
      },
      finally: () => {
        item.loading = false;
      },
    });
  }
}
</script>
