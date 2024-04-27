<template lang="pug">
card(:title="`Asignar Empleados - ${structure}`")
  v-data-table.mt-12(
    :items="employees"
    :headers="headers",
  )
    template(v-slot:item.categoriaId="{item}")
      v-checkbox(v-model="item.categoriaId" :disabled="!categoryId" :color="categoryColors[item.categoriaId]" @change="onCbxClick($event,item)")
  template(v-slot:header-end)
    div.d-flex.justify-end.align-center
      v-select.mr-6(
        v-model="categoryId"
        :items="categories",
        style="max-width:450px; width:450px"
        label="Categorías",
        item-text="denominacion",
        item-value="id",
        outlined,
        dense,
        hide-details,
        clearable    
      )
        template(v-slot:item="{ item }")
          div.color-box(:style="{ backgroundColor:item.color }")
          span {{item.denominacion}}
      v-btn(color="primary", :loading="isLoading", @click="saveAssignCategory") Guardar
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Categoria } from "~/types";

interface CategoryEmployee {
  categoriaId: number;
  empleadoId: number;
}

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Asignar" };
  },
})
export default class ShiftWorkPage extends Vue {
  isLoading: boolean = false;

  employees: any[] = [];
  structure: string = "";
  categories: Categoria[] = [];

  categoryColors: any = {};

  categoryId: number = 0;

  requestData: CategoryEmployee[] = [];

  headers: any = [
    // ...this.a,
    { text: "Categoria", value: "categoriaId", sortable: false, width: 100 },
    { text: "ID", value: "id", width: 75 },
    { text: "DNI", value: "numeroDoc" },
    { text: "Nombre Completo", value: "nombreCompleto" },
    { text: "Profesión", value: "profesion" },
    { text: "Cargo", value: "condicionLaboral" },
  ];

  onCbxClick(event: boolean, item: any) {
    item.categoriaId = event ? this.categoryId : null;
  }

  async saveAssignCategory() {
    this.requestData = this.employees
      .filter((e) => e.categoriaId)
      .map((e) => ({
        categoriaId: e.categoriaId,
        empleadoId: e.id,
      }));

    await this.$axios.buildResponse({
      notify: "always",
      request: {
        method: "POST",
        url: "/api/category/assign",
        data: this.requestData,
      },
      ifOk: () => {
        this.$router.replace("/category");
      },
    });
  }

  mounted() {
    this.$axios.buildResponse<any>({
      paginated: false,
      request: "api/common/category/employees",
      ifOk: ({ payload }) => {
        this.structure = payload.organigrama;
        this.categories = payload.categorias;
        this.categoryColors = Object.fromEntries(
          payload.categorias.map((c: any) => [c.id, c.color]),
        );
        this.employees = payload.empleados;
      },
    });
  }
}
</script>
<style>
.color-box {
  border-radius: 8px;
  border: 1px solid black;
  width: 25px;
  height: 25px;
  margin-right: 12px;
}
</style>
