<template lang="pug">
card(:title="'Nuevo Cargo'")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="createPosition", color="primary") Guardar
  v-form.text-center(ref="newPositionForm")
    v-row
      v-col(cols=12, md=6)
        v-select(
          v-model="position.clasificacionId",
          :items="clasifications",
          filled,
          item-text="denominacion",
          item-value="id",
          label="Clasificacion"
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="position.id",
          :rules="requiredRule",
          filled,
          label="Código"
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="position.denominacion",
          :rules="requiredRule",
          filled,
          label="Denominacion"
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Cargo } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Cargo" };
  },
})
export default class extends Vue {
  @Ref()
  readonly newPositionForm!: HTMLFormElement;

  isLoading: boolean = false;

  clasifications: any[] = [];

  position: Partial<Cargo> = {
    esEncargado: false,
  };

  async createPosition() {
    if (this.newPositionForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/position",
          data: this.position,
        },
        ifOk: () => {
          this.$router.replace("/");
        },
      });
      this.isLoading = false;
    }
  }

  mounted() {
    this.$axios.buildResponse({
      request: {
        method: "GET",
        url: "/api/master/clasification",
        params: { itemsPerPage: -1 },
      },
      paginated: true,
      ifOk: ({ payload }) => {
        this.clasifications = payload.items;
        this.clasifications.forEach((c) => {
          c.denominacion = `${c.abreviatura} : ${c.denominacion}`;
        });
      },
    });
  }
}
</script>
