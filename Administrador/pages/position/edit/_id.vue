<template lang="pug">
card(:title="'Editar Cargo'")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="updatePosition", color="primary") Guardar
  v-form.text-center(ref="editPositionForm")
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
    return { title: "Editar Cargo" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editPositionForm!: HTMLFormElement;

  isLoading: boolean = false;

  clasifications: any[] = [];

  position: Partial<Cargo> = {
    esEncargado: false,
  };

  async updatePosition() {
    if (this.editPositionForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/position/${this.$route.params.id}`,
          data: this.position,
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
    this.$axios.buildResponses({
      requests: [
        this.$axios.getResponse<Cargo>({
          request: {
            method: "GET",
            url: `/api/position/${this.$route.params.id}`,
          },
        }),
        this.$axios.getResponse<any>({
          request: {
            method: "GET",
            url: "/api/master/clasification",
            params: { itemsPerPage: -1 },
          },
          paginated: true,
        }),
      ],
      ifOk([p, c]) {
        self.position = p;
        self.clasifications = c.items;
        self.clasifications.forEach((c) => {
          c.denominacion = `${c.abreviatura} : ${c.denominacion}`;
        });
      },
    });
  }
}
</script>
