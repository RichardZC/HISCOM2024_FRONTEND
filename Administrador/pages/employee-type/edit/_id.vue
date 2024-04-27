<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(
      depressed,
      color="primary",
      :loading="isLoading",
      @click="updateEmployeeType"
    ) Guardar
  v-form.text-center(ref="editEmployeeTypeForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="employeeType.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          required,
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
    return { title: "Tipo de Empleado" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editEmployeeTypeForm!: HTMLFormElement;

  isLoading: boolean = false;

  employeeType: Partial<TipoEmpleado> = {};

  async updateEmployeeType() {
    if (this.editEmployeeTypeForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/employee-type/${this.$route.params.id}`,
          data: this.employeeType,
        },
        ifOk: () => {
          this.$router.replace("/master");
        },
      });

      this.isLoading = false;
    }
  }

  mounted() {
    const self = this;
    this.$axios.buildResponses<any>({
      requests: [
        this.$axios.getResponse<TipoEmpleado>({
          request: {
            method: "GET",
            url: `/api/employee-type/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.employeeType = result[0];
      },
    });
  }
}
</script>
