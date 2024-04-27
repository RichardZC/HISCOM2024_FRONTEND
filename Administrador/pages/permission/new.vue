<template lang="pug">
card(:title="'Nuevo permiso'")
  template(v-slot:header-end)
    v-btn(
      :loading="isLoading",
      @click="createPermission",
      color="primary",
      depressed
    ) Guardar
  v-form.text-center(ref="newPermissionForm")
    v-row
      v-col(cols="12", md="6")
        v-autocomplete(
          v-model="permission.menuId",
          :item-value="(x) => parseInt(x.id)",
          :items="menus",
          filled,
          item-text="nombre",
          label="Seleccione menu"
        )
      v-col.d-flex.align-center(cols="12", md="6")
        v-text-field(
          v-if="isNewSubmenu",
          v-model="permission.subMenu",
          filled,
          label="Nuevo submenu"
        )
        v-select(
          v-else,
          v-model="permission.subMenu",
          :items="submenus",
          filled,
          label="Seleccione submenu"
        )
        v-btn.ml-2(
          @click="isNewSubmenu = !isNewSubmenu",
          color="primary",
          icon,
          style="margin-bottom: 30px"
        )
          v-icon {{ isNewSubmenu ? 'mdi-cursor-pointer' : 'mdi-plus' }}
      v-col(cols="12", md="6")
        v-text-field(
          v-model="permission.accion",
          :rules="requiredRule",
          filled,
          label="Acción",
          required
        )
      v-col(cols="12", md="6")
        v-text-field(v-model="permission.ruta", filled, label="Ruta")
      v-col(cols="12", md="6")
        v-text-field(
          v-model="permission.nombre",
          :rules="requiredRule",
          filled,
          label="Nombre"
        )
      v-col(cols="12", md="6")
        v-text-field(
          v-model="permission.descripcion",
          filled,
          label="Descripción"
        )
      v-col(cols="12", md="6")
        v-checkbox(v-model="permission.visible", label="Visible", required)
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Menu, Permiso } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Permiso" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newPermissionForm!: HTMLFormElement;

  isLoading: boolean = false;
  isNewSubmenu: boolean = false;

  permission: Permiso = {
    menuId: 0,
    subMenu: "",
    accion: "",
    ruta: "",
    nombre: "",
    descripcion: "",
    visible: false,
  };

  menus: Menu[] = [];
  submenus: string[] = [];

  async createPermission() {
    if (this.newPermissionForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/permission",
          data: this.permission,
        },
        ifOk: () => {
          this.$router.replace("/permission");
        },
      });
      this.isLoading = false;
    }
  }

  async mounted() {
    const responses = await Promise.all([
      this.$axios.get("/api/menu?itemsPerPage=-1"),
      this.$axios.get("/api/common/submenus"),
    ]);

    this.menus = responses[0].data.items;
    this.submenus = responses[1].data;
  }
}
</script>
