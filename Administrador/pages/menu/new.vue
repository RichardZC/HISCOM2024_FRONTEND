<template lang="pug">
card(:title="'Nuevo Menu'")
  template(v-slot:header-end)
    v-btn(
      depressed,
      color="primary",
      :loading="isLoading",
      @click="createMenu"
    ) Guardar
  v-form.text-center(ref="newMenuForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="menu.nombre",
          :rules="requiredRule",
          label="Nombre",
          required,
          filled
        )
      v-col(cols=12, md=6)
        v-autocomplete(
          v-model="menu.icono",
          :items="icons",
          item-text="name",
          item-value="name",
          label="Ícono",
          required,
          filled
        )
          template(v-slot:selection="data")
            v-icon.mr-6 {{ `mdi-${data.item.name}` }}
            span {{ data.item.name }}
          template(v-slot:item="data")
            v-icon.mr-6 {{ `mdi-${data.item.name}` }}
            span {{ data.item.name }}
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Menu } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Menu" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newMenuForm!: HTMLFormElement;

  isLoading: boolean = false;
  icons: any[] = require("~/assets/icons.json");

  menu: Menu = {
    nombre: "",
    icono: "",
  };

  async createMenu() {
    if (this.newMenuForm.validate()) {
      this.isLoading = true;
      this.menu.icono = `mdi-${this.menu.icono}`;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/menu",
          data: this.menu,
        },
        ifOk: () => {
          this.$router.replace("/menu");
        },
      });
      this.isLoading = false;
    }
  }
}
</script>
