import { Vue, Component } from "nuxt-property-decorator";

type Rule = Array<Function>;
type vInput = string | undefined | null | number;

const MIN_PASSWORD_LENGTH = 8;

@Component
class RuleMixin extends Vue {
  requiredRule: Rule = [
    (v: vInput) =>
      (!!v && String(v).trim().length > 0) || "Este campo es requerido",
  ];

  requiredNumberRule: Rule = this.requiredRule.concat([
    (v: vInput) =>
      Number(v) >= 0 || "Este campo debe ser un número mayor o igual a 0",
  ]);

  requiredSelectNumberRule: Rule = [
    (v: vInput) =>
      (typeof v === "number" && v > 0) || "Este campo es requerido",
  ];

  requiredSelectMultipleRule: Rule = [
    (v: vInput) =>
      (Array.isArray(v) && v.length > 0) || "Seleccione al menos uno",
  ];

  fileRequiredRule: Rule = [(v: any) => !!v || "Seleccione un archivo"];

  filesRequiredRule: Rule = [
    (v: Array<any>) =>
      (Array.isArray(v) && v.length > 0) || "Seleccione al menos un archivo",
  ];

  genderRule: Rule = [(v: any) => !!v || "Gender is required"];

  emailRule: Rule = this.requiredRule.concat([
    (v: string) => /.+@.{2,}\..{2,}/.test(v) || "El email es inválido",
  ]);

  passwordRule: Rule = this.requiredRule.concat([
    (v: string) =>
      (v && v.length >= MIN_PASSWORD_LENGTH) ||
      "El campo debe tener al menos 8 carácteres",
  ]);

  nameRule: any[] = this.requiredRule.concat([
    (v: any) =>
      (v && v.length <= 50) ||
      "El campo nombre debe contener menos de 50 caracteres",
  ]);

  lastNameRule: any[] = [(v: any) => !!v || "El campo apellidos es requerido"];
}

Vue.mixin(RuleMixin);
