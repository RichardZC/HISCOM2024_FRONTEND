<template lang="pug">
card(:title="'Editar Permiso'")
  template(v-slot:header-end)
    v-btn(
      depressed,
      color="primary",
      :loading="isLoading",
      @click="updatePermission"
    ) Guardar
  v-form.text-center(ref="editPermissionForm")
    v-row
      v-col(cols="12", md="6")
        v-autocomplete(
          v-model="permission.menuId",
          :items="menus",
          label="Menu",
          item-text="nombre",
          :item-value="(x) => parseInt(x.id)",
          filled
        )
      v-col.d-flex.align-center(cols="12", md="6")
        v-text-field(
          v-if="isNewSubmenu",
          v-model="permission.subMenu",
          label="Nuevo submenu",
          filled
        )
        v-select(
          v-else,
          v-model="permission.subMenu",
          :items="submenus",
          label="Seleccione submenu",
          filled
        )
        v-btn.ml-2(
          @click="isNewSubmenu = !isNewSubmenu",
          color="primary",
          style="margin-bottom: 30px",
          icon
        )
          v-icon {{ isNewSubmenu ? 'mdi-cursor-pointer' : 'mdi-plus' }}
      v-col(cols="12", md="6")
        v-text-field(
          v-model="permission.accion",
          label="Acción",
          required,
          filled
        )
      v-col(cols="12", md="6")
        v-text-field(v-model="permission.ruta", label="Ruta", required, filled)
      v-col(cols="12", md="6")
        v-text-field(
          v-model="permission.nombre",
          label="Nombre",
          required,
          filled
        )
      v-col(cols="12", md="6")
        v-text-field(
          v-model="permission.descripcion",
          label="Descripción",
          required,
          filled
        )
      v-col(cols="12", md="6")
        v-checkbox(v-model="permission.visible", label="Visible", required)
</template>
<script lang="ts">
import { Vue, Ref, Component } from "nuxt-property-decorator";
import { Menu, Permiso } from "~/types";

@Component({
  layout: "app",
  head() {
    return { title: "Editar Permiso" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editPermissionForm!: HTMLFormElement;

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

  async updatePermission() {
    this.isLoading = true;

    await this.$axios.buildResponse({
      notify: "always",
      request: {
        method: "PUT",
        url: `/api/permission/${this.$route.params.id}`,
        data: this.permission,
      },
      ifOk: () => {
        this.$router.replace("/permission");
      },
    });

    this.isLoading = false;
  }

  async mounted() {
    const responses = await Promise.all([
      this.$axios.get(`/api/permission/${this.$route.params.id}`),
      this.$axios.get("/api/menu?itemsPerPage=-1"),
      this.$axios.get("/api/common/submenus"),
    ]);

    this.permission = responses[0].data;
    this.menus = responses[1].data.items;
    this.submenus = responses[2].data;
  }
}
</script>
