<template lang="pug">
card(title="Editar")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="updateTurn") Guardar
  v-form.text-center(ref="editTurnForm")
    v-row(justify="center")
      v-col(cols=12, md=6)
        v-text-field(
          v-model="turn.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="turn.descripcion",
          :rules="requiredRule",
          label="Descripcion",
          filled
        )
      v-col(cols=12, md=6)
        v-text-field(
          v-model="turn.horas",
          :rules="requiredNumberRule",
          label="Horas",
          filled
        )
      v-col(cols=12, md=6)
        v-menu(
          ref="menu",
          v-model="menupicker",
          :close-on-content-click="false",
          :nudge-right="40",
          :return-value.sync="turn.horaInicio",
          transition="scale-transition",
          offset-y,
          max-width="290px",
          min-width="290px",
        )
          template(v-slot:activator="{ on, attrs }")
            v-text-field(v-model="turn.horaInicio" label="Hora de inicio" prepend-icon="mdi-clock-time-four-outline" readonly="" v-bind="attrs" v-on="on")
          v-time-picker(v-if="menupicker" v-model="turn.horaInicio" full-width="" @click:minute="$refs.menu.save(turn.horaInicio)")
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Turno } from "~/types";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Editar Turno" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editTurnForm!: HTMLFormElement;

  isLoading: boolean = false;

  turn: Partial<Turno> = {};

  menupicker: boolean = false;

  async updateTurn() {
    if (this.editTurnForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/turn/${this.$route.params.id}`,
          data: this.turn,
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
        this.$axios.getResponse<Turno>({
          request: {
            method: "GET",
            url: `/api/turn/${this.$route.params.id}`,
          },
        }),
      ],
      ifOk(result: any[]) {
        self.turn = result[0];
      },
    });
  }
}
</script>
