<template lang="pug">
div
  v-snackbar(v-model="snackbar", light) {{ errorMessage }}
    template(v-slot:action="{ attrs }")
      v-btn(v-bind="attrs", @click="snackbar = false", color="primary", text) Cerrar
  v-container.r__v-container.primary.d-flex.justify-center.align-center(fluid)
    v-card.r__v-card.px-6.pt-6.pb-3.mx-0
      img.r__img.mb-6(:src="require('@/assets/logo.jpg')")
      v-form(ref="loginForm")
        v-text-field(
          v-model="loginData.usuario",
          :rules="requiredRule",
          @keyup.enter="login",
          append-icon="mdi-account",
          filled,
          label="Usuario o Correo"
        )
        v-text-field(
          v-model="loginData.clave",
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'",
          :rules="requiredRule",
          :type="showPassword ? 'text' : 'password'",
          @click:append="showPassword = !showPassword",
          @keyup.enter="login",
          filled,
          label="Contraseña"
        )
        .text-center.mt-6
          v-btn(:loading="isLogging", @click="login", color="primary") Login
        .text-center.mt-4
          v-btn(@click="toPatient", small, text) Examenes
            v-icon(right, small) mdi-open-in-new
          v-btn(@click="toCita", small, text) Citas
            v-icon(right, small) mdi-open-in-new
          v-btn(@click="toDocumento", small, text) Documentos
            v-icon(right, small) mdi-open-in-new
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { LoginRequest } from "~/types";

@Component({
  auth: "guest",
  // Head configuration.
  head() {
    return { title: "Iniciar sesión" };
  },
})
export default class LoginPage extends Vue {
  @Ref()
  readonly loginForm!: HTMLFormElement;

  showPassword: boolean = false;

  isLogging: boolean = false;
  loginData: LoginRequest = {
    usuario: "",
    clave: "",
  };

  snackbar: boolean = false;
  errorMessage: string = "Error al iniciar sesión";

  toPatient() {
    window.open("login/examenes", "_blank");
  }
  toCita() {
    window.open("consultar-cita", "_blank");
  }
  toDocumento() {
    window.open("buscar", "_blank");
  }
  async login() {
    this.isLogging = true;
    try {
      if (this.loginForm.validate()) {
        await this.$auth.loginWith("local", {
          data: this.loginData,
        });
      }
    } catch (error) {
      this.snackbar = true;
      this.errorMessage = String(error);
    } finally {
      this.isLogging = false;
    }
  }
}
</script>

<style>
.r__v-container {
  height: 100vh;
  margin: 0;
  padding: 0;
}
.r__v-card {
  min-width: 400px;
  max-width: 500px;
}

.r__img {
  max-width: 300px;
  height: auto;
}

@media only screen and (max-width: 600px) {
  .r__v-card {
    width: 90vw;
    min-width: unset;
    max-height: 90vh;
  }
  .r__img {
    width: 85% !important;
    max-width: 250px;
  }
}
</style>
