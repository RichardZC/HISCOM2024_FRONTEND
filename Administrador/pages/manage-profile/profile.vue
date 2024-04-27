<template lang="pug">
card(title="Mi Perfil")
  v-form.text-center(ref="profileForm")
    v-row(justify="center")
      v-col.d-flex.justify-center(cols=12, md=6)
        .text-center
          v-img(
            :src="profile.foto ? profile.foto : require('~/assets/employees/user-placeholder.png')",
            max-height="300",
            max-width="350"
          )
          .pt-3
            span {{ profile.nombreCompleto }}
            br
            span {{ profile.correo }}
      v-col(cols=12, md=6)
        v-subheader Cambiar Contraseña
        v-divider
        v-row.pa-3
          v-col(cols=12)
            v-text-field(
              v-model="profile.contrasenaActual",
              :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'",
              :rules="passwordRule",
              :type="showCurrentPassword ? 'text' : 'password'",
              @click:append="showCurrentPassword = !showCurrentPassword",
              filled,
              label="Contraseña actual*"
            )
          v-col(cols=12)
            v-text-field(
              v-model="profile.contrasenaNueva",
              :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'",
              :rules="[...passwordRule, passwordConfirmationRule]",
              :type="showNewPassword ? 'text' : 'password'",
              @change="onPasswordChange",
              @click:append="showNewPassword = !showNewPassword",
              filled,
              label="Contraseña nueva*"
            )
          v-col(cols=12)
            v-text-field(
              v-model="profile.reContrasenaNueva",
              :append-icon="showRePassword ? 'mdi-eye' : 'mdi-eye-off'",
              :rules="[...passwordRule, passwordConfirmationRule]",
              :type="showRePassword ? 'text' : 'password'",
              @change="onPasswordChange",
              @click:append="showRePassword = !showRePassword",
              filled,
              label="Repetir contraseña*"
            )
          v-col(cols=12)
            v-btn(
              :loading="isLoading",
              @click="manageProfile",
              color="primary"
            ) Cambiar Contraseña
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";

interface Profile {
  foto: string;
  nombreCompleto: string;
  correo: string;
  contrasenaActual: string;
  contrasenaNueva: string;
  reContrasenaNueva: string;
}

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Turno" };
  },
})
export default class extends Vue {
  @Ref()
  readonly profileForm!: HTMLFormElement;

  isLoading: boolean = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showRePassword = false;

  profile: Partial<Profile> = {};

  get passwordConfirmationRule() {
    return () =>
      this.profile.contrasenaNueva === this.profile.reContrasenaNueva ||
      "Las contraseñas no coinciden";
  }

  get onPasswordChange() {
    return () => this.profileForm?.validate?.();
  }

  async manageProfile() {
    if (this.profileForm.validate()) {
      this.isLoading = true;
      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "POST",
          url: "/api/common/change-password",
          data: this.profile,
        },
        ifOk: () => {
          this.profile.contrasenaActual = "";
          this.profile.contrasenaNueva = "";
          this.profile.reContrasenaNueva = "";
          this.profileForm.reset();
        },
      });
      this.isLoading = false;
    }
  }

  mounted() {
    this.$axios.buildResponse<any>({
      request: {
        method: "GET",
        url: `/api/common/manage-profile`,
      },
      paginated: false,
      ifOk: ({ payload }) => {
        this.profile = payload;
      },
      ifErr: () => {
        this.$router.replace("/");
      },
    });
  }
}
</script>
