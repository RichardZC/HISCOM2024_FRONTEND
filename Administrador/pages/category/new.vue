<template lang="pug">
card(:title="`Nueva Categoría - ${$auth.user.empleado.organigrama.denominacion}`")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="createCategory") Guardar
  v-form.text-center(ref="newCategoryForm")
    v-row.justify-center.mt-8
      v-col(cols=12, md=8)
        v-text-field(
          v-model="category.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
        v-subheader.text-center Color
        v-color-picker(v-model="colorRgba" dot-size="25" swatches-max-height="200" mode="rgba")

</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Categoria, Color } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nueva Categoria" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newCategoryForm!: HTMLFormElement;

  isLoading: boolean = false;

  category: Partial<Categoria> = {
    organigramaId: this.$auth.user.empleado.organigramaId,
  };

  colorRgba: Color = { r: 255, g: 255, b: 255, a: 255 };

  async createCategory() {
    if (this.newCategoryForm.validate()) {
      this.isLoading = true;
      this.category.color = `rgba(${this.colorRgba.r},${this.colorRgba.g},${this.colorRgba.b},${this.colorRgba.a})`;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/category",
          data: this.category,
        },
        ifOk: () => {
          this.$router.replace("/category");
        },
      });
      this.isLoading = false;
    }
  }
}
</script>
