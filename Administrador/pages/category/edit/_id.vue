<template lang="pug">
card(:title="`Editar Categoría - ${$auth.user.empleado.organigrama.denominacion}`")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="updatecategory") Guardar
  v-form.text-center(ref="editCategoryForm")
    v-row.justify-center.mt-4
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
    return { title: "Editar Categoría" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editCategoryForm!: HTMLFormElement;

  isLoading: boolean = false;

  category: Partial<Categoria> = {};
  colorRgba: Color = { r: 255, g: 255, b: 255, a: 1 };

  async updatecategory() {
    if (this.editCategoryForm.validate()) {
      this.isLoading = true;
      this.category.color = `rgba(${this.colorRgba.r},${this.colorRgba.g},${this.colorRgba.b},${this.colorRgba.a})`;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/category/${this.$route.params.id}`,
          data: this.category,
        },
        ifOk: () => {
          this.$router.replace("/category");
        },
      });
      this.isLoading = false;
    }
  }

  mounted() {
    this.$axios.buildResponses({
      requests: [
        this.$axios.getResponse<Categoria>({
          request: {
            method: "GET",
            url: `/api/category/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk: (result: any[]) => {
        this.category = result[0];

        const idxsColor = result[0].color
          .replace("rgba(", "")
          .replace(")", "")
          .split(",");
        if (idxsColor && idxsColor.length === 4) {
          this.colorRgba = {
            r: parseInt(idxsColor[0]),
            g: parseInt(idxsColor[1]),
            b: parseInt(idxsColor[2]),
            a: parseInt(idxsColor[3]),
          };
        }
      },
    });
  }
}
</script>
