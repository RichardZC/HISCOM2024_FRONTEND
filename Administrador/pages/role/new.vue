<template lang="pug">
card(title="Nuevo rol")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="createRole") Guardar
  v-form.text-center(ref="newRoleForm")
    v-row
      v-col(cols=12, md=6)
        v-text-field(
          v-model="role.denominacion",
          :rules="requiredRule",
          label="Nombre",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(v-model="role.descripcion", label="Descripción", filled)
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Rol } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Rol" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newRoleForm!: HTMLFormElement;

  isLoading: boolean = false;

  role: Rol = {
    denominacion: "",
    descripcion: "",
  };

  async createRole() {
    if (this.newRoleForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/role",
          data: this.role,
        },
        ifOk: () => {
          this.$router.replace("/role");
        },
      });
      this.isLoading = false;
    }
  }
}
</script>
