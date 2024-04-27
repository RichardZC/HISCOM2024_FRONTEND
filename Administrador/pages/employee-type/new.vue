<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="createEmployeeType") Guardar
  v-form.text-center(ref="newEmployeeTypeForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="employeeType.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { TipoEmpleado } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Tipo de Empleado" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newEmployeeTypeForm!: HTMLFormElement;

  isLoading: boolean = false;

  employeeType: TipoEmpleado = {
    denominacion: "",
  };

  async createEmployeeType() {
    if (this.newEmployeeTypeForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/employee-type",
          data: this.employeeType,
        },
        ifOk: () => {
          this.$router.replace("/master");
        },
      });
      this.isLoading = false;
    }
  }
}
</script>
