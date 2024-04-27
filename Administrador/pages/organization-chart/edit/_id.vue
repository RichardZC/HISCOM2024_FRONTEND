<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="updateOChart") Guardar
  v-form.text-center(ref="editOChartForm")
    v-row
      v-col(cols=12, md=12)
        o-chart-autocomplete(v-model="structure.padreId")
      v-col(cols=12, md=6)
        v-select(
          v-model="structure.nivelId",
          :items="levels",
          label="Nivel",
          item-text="denominacion",
          item-value="id",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="structure.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { OChart } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Editar Estructura Orgánica" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editOChartForm!: HTMLFormElement;

  isLoading: boolean = false;

  structure: Partial<OChart> = {};

  levels: any[] = [];

  async updateOChart() {
    if (this.editOChartForm.validate()) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/organization-chart/${this.$route.params.id}`,
          data: this.structure,
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
        this.$axios.getResponse<OChart>({
          request: {
            method: "GET",
            url: `/api/organization-chart/${this.$route.params.id}`,
          },
        }),

        this.$axios.getResponse<any>({
          request: {
            method: "GET",
            url: "/api/master/level",
            params: { itemsPerPage: -1 },
          },
          paginated: true,
        }),
      ],
      ifOk([o, l]) {
        self.structure = o;
        self.levels = l.items;
      },
    });
  }
}
</script>
