<template lang="pug">
v-container
  .grid-container
    nuxt-link(to="/shift-work")
      .grid-item
        img(
          :src="require('~/assets/schedule.png')",
          style="height: 125px; width: 125px"
        )
        br
        span Rol de turnos
    nuxt-link(to="/payroll")
      .grid-item
        img(
          :src="require('~/assets/invoice.png')",
          style="height: 125px; width: 125px"
        )
        br
        span Boleta de pago
    nuxt-link(to="/marking")
      .grid-item
        img(
          :src="require('~/assets/dials.png')",
          style="height: 125px; width: 125px"
        )
        br
        span Marcaciones
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Dashboard" };
  },
})
export default class DashboardPage extends Vue {
  /*   mounted() {
    this.$axios.buildResponse<Usuario>({
      notify: false,
      paginated: true,
      request: { method: "GET", url: "/api/userxd" },
      ifOk: (ok) => {},
      ifErr: (err) => {},
    });
  } */
}
</script>
<style scoped>
a {
  text-decoration: none;
}
.grid-item {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 20px;
  box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.12) 0px 3px 1px -2px, rgba(0, 0, 0, 0.2) 0px 1px 5px 0px;
  box-sizing: border-box;
  background-color: white;
  text-align: center;
  max-width: 225px;
  min-width: 200px;
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-gap: 30px;
  margin-right: 25px;
  margin-left: 25px;
  padding-top: 25px;
  justify-content: center;
}
</style>
