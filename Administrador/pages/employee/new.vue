<template lang="pug">
card(title="Crear")
  template(v-slot:header-end)
    v-btn(:loading="isLoading", @click="createEmployee", color="primary") Guardar
  v-stepper.elevation-0(v-model="step", non-linear)
    v-stepper-header.elevation-0
      v-stepper-step(:rules="[() => formValid[0]]", editable, step="1")
        | Información Pública*
      v-divider
      v-stepper-step(:rules="[() => formValid[1]]", editable, step="2")
        | Información Laboral*
      v-divider
      v-stepper-step(:rules="[() => formValid[2]]", editable, step="3")
        | Datos del Usuario*
      v-divider
      v-stepper-step(:rules="[() => formValid[3]]", editable, step="4")
        | Información Personal*
      v-divider
      v-stepper-step(:rules="[() => formValid[4]]", editable, step="5")
        | Cuentas Bancarias

    v-stepper-items
      //- Page 1
      v-stepper-content(step="1")
        v-form.text-center(ref="form1")
          v-row(justify="center")
            v-col(cols=12, md=4)
              v-select(
                v-model="employee.tipoDocumentoId",
                :items="docTypes",
                :rules="requiredSelectNumberRule",
                filled,
                item-text="denominacion",
                item-value="id",
                label="Tipo de Documento*",
                required
              )
            v-col(cols=12, md=4)
              v-text-field(
                v-model="employee.numeroDoc",
                :rules="requiredRule",
                filled,
                label="Numero de documento*",
                maxlength="12",
                required
              )
            v-col(cols=12, md=4)
              v-select(
                v-model="employee.nacionalidadId",
                :disabled="employee.tipoDocumentoIdentidad === 'DNI' && employee.nacionalidadId === 1",
                :item-value="(x) => parseInt(x.id)",
                :items="nacionalidad",
                filled,
                item-text="pais",
                label="Nacionalidad"
              )
            v-col.d-flex.align-center(cols=12, md=4)
              v-text-field(
                v-model="employee.apellidoPaterno",
                :rules="requiredRule",
                filled,
                label="Apellido Paterno*"
              )
            v-col(cols=12, md=4)
              v-text-field(
                v-model="employee.apellidoMaterno",
                :rules="requiredRule",
                filled,
                label="Apellido Materno*"
              )
            v-col(cols=12, md=4)
              v-text-field(
                v-model="employee.nombres",
                :rules="requiredRule",
                filled,
                label="Nombres*"
              )

            v-col(v-if="isResponsive", cols=12)
              v-btn(@click="nextPage(1)", color="primary", icon)
                v-icon mdi-arrow-right
            v-col.text-right(v-else, cols=12)
              v-btn(@click="nextPage(1)", color="primary") Continuar

      //- Page 2
      v-stepper-content(step="2")
        v-form.text-center(ref="form2")
          v-row(justify="center")
            v-col(cols=12, md=6)
              o-chart-autocomplete(v-model="employee.organigramaId", 
              required,
              :rules="requiredSelectNumberRule")
            v-col(cols=12, md=6)
              api-autocomplete(
                v-model="employee.cargoId",
                :items="positions",
                :rules="requiredRule",
                filled,
                item-text="denominacion",
                item-value="id",
                label="Cargo*",
                model="master/position",
                no-data-text="Cargos no encontrados"
              )
            v-col(cols=12, md=6)
              v-select(
                v-model="employee.tipoEmpleadoId",
                :item-value="(x) => parseInt(x.id)",
                :items="employeeType",
                :rules="requiredSelectNumberRule",
                filled,
                item-text="denominacion",
                label="Tipo Empleado*"
              )
            v-col(cols=12, md=6)
              v-select(
                v-model="employee.condicionLaboralId",
                :items="workingCondition",
                :rules="requiredRule",
                filled,
                item-text="denominacion",
                item-value="id",
                label="Condición Laboral*"
              )
            v-col.pb-0(cols=12, md=6)
              v-select(
                v-model="employee.profesionId",
                :items="professions",
                filled,
                item-text="denominacion",
                item-value="id",
                label="Profesión*"
              )
            v-col(cols=12, sm=6)
              v-select(
                v-model="employee.colegioProfesionalId",
                :item-value="(x) => parseInt(x.id)",
                :items="professionalColleges",
                :rules="requiredSelectNumberRule",
                filled,
                item-text="denominacion",
                label="Colegio Profesional*"
              )
            v-col(cols=12, sm=6)
              v-text-field(
                v-model="employee.numeroColegiatura",
                :rules="requiredRule",
                filled,
                label="Nro. Colegiatura*"
              )
            v-col(cols=12, md=6)
              v-menu(
                v-model="startMenu",
                :close-on-content-click="false",
                :nudge-right="40",
                min-width="auto",
                offset-y,
                transition="scale-transition"
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field.pb-0(
                    v-bind="attrs",
                    v-model="startDate",
                    v-on="on",
                    :rules="requiredRule",
                    filled,
                    label="Fecha inicio de labores",
                    prepend-icon="mdi-calendar"
                  )
                v-date-picker(
                  v-model="employee.fechaIngreso",
                  @input="startMenu = false"
                )

            v-col(cols=12, md=6)
              v-menu(
                v-model="appointmentMenu",
                :close-on-content-click="false",
                :nudge-right="40",
                min-width="auto",
                offset-y,
                transition="scale-transition"
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field.pb-0(
                    v-bind="attrs",
                    v-model="appointmentDate",
                    v-on="on",
                    :rules="requiredRule",
                    filled,
                    label="Fecha de nombramiento",
                    prepend-icon="mdi-calendar"
                  )
                v-date-picker(
                  v-model="employee.fechaNombramiento",
                  @input="appointmentMenu = false"
                )

            v-col(v-if="isResponsive", cols=12, sm=12)
              v-btn(@click="nextPage(2)", color="primary", icon)
                v-icon mdi-arrow-right
            v-col.text-right(v-else, cols=12, sm=12)
              v-btn(@click="nextPage(2)", color="primary") Continuar

      //- Page 3
      v-stepper-content(step="3")
        v-form.text-center(ref="form3")
          v-row(justify="center") 
            v-col(cols=12, md=6)
              v-row
                v-col(cols=12)
                  v-text-field(
                    v-model="employee.correoUsuario",
                    :rules="emailRule",
                    filled,
                    label="Correo de la Institucion*"
                  )
                v-col(cols=12)
                  v-select(
                    v-model="employee.roles",
                    :item-value="(x) => parseInt(x.id)",
                    :items="roles",
                    :rules="requiredSelectMultipleRule",
                    chips,
                    deletable-chips,
                    filled,
                    item-text="denominacion",
                    label="Roles Sistema*",
                    multiple
                  )
            v-col.d-flex.justify-center(cols=12, md=6)
              image-input(
                v-model="employee.foto",
                message="Suelte la foto del empleado o"
              )

            v-col(v-if="isResponsive", cols=12)
              v-btn(@click="nextPage(3)", color="primary", icon)
                v-icon mdi-arrow-right
            v-col.text-right(v-else, cols=12)
              v-btn(@click="nextPage(3)", color="primary") Continuar

      //- Page 4
      v-stepper-content(step="4")
        v-form.text-center(ref="form4")
          v-row(justify="center") 
            v-col(cols=12, md=3)
              v-menu(
                v-model="birthdayMenu",
                :close-on-content-click="false",
                :nudge-right="40",
                min-width="auto",
                offset-y="",
                transition="scale-transition"
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field(
                    v-bind="attrs",
                    v-model="birthday",
                    v-on="on",
                    :rules="requiredRule",
                    filled,
                    label="Fecha Nacimiento*",
                    prepend-icon="mdi-calendar"
                  )
                v-date-picker(
                  v-model="employee.nacimiento",
                  @input="birthdayMenu = false"
                )
            v-col(cols=12, md=3)
              v-select(
                v-model="employee.sexo",
                :items="gender",
                :rules="requiredRule",
                filled,
                item-text="den",
                item-value="abbr",
                label="Sexo*"
              ) 
            v-col.d-flex.align-center(cols=12, md=3) 
              v-select(
                v-model="employee.estadoCivilId",
                :items="maritalStatus",
                filled,
                item-text="denominacion",
                item-value="id",
                label="Estado Civil"
              )
            v-col(cols=12, md=3) 
              v-text-field(
                v-model="employee.telefonos",
                filled,
                label="Teléfonos",
                maxlength="9",
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              )

            v-col(cols=12, md=6)
              v-text-field(v-model="employee.correos", filled, label="Correos")
            v-col(cols=12, md=6)
              v-text-field(
                v-model="employee.direccion",
                filled,
                label="Dirección"
              )

            v-col(v-if="isResponsive", cols=12)
              v-btn(@click="nextPage(4)", color="primary", icon)
                v-icon mdi-arrow-right
            v-col.text-right(v-else, cols=12)
              v-btn(@click="nextPage(4)", color="primary") Continuar

      //- Page 5
      v-stepper-content(step="5")
        v-form.text-center(ref="form5")
          v-row(justify="center")
            v-col(cols=12, md=6)
              v-select(
                v-model="employee.bancoId",
                :item-value="(x) => parseInt(x.id)",
                :items="banks",
                filled,
                item-text="nombre",
                label="Banco"
              )
            v-col(cols=12, md=6)
              v-select(
                v-model="employee.tipoCuentaId",
                :items="accountTypes",
                filled,
                item-text="denominacion",
                item-value="id",
                label="Tipo de cuenta"
              )
            v-col.d-flex.align-center(cols=12, md=6)
              v-text-field(
                v-model="employee.numeroCuenta",
                :disabled="!employee.bancoId || !employee.tipoCuentaId",
                filled,
                label="N° de cuenta"
              )
            v-col(cols=12, md=6)
              v-text-field(
                v-model="employee.cuentaInterbancaria",
                :disabled="!employee.bancoId || !employee.tipoCuentaId",
                filled,
                label="Cuenta Interbancaria"
              )
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from "nuxt-property-decorator";
import axios from "axios";
import {
  Empleado,
  TipoEmpleado,
  Cargo,
  Profesion,
  ColegioProfesional,
  Banco,
  Rol,
  Nacionalidad,
  CondicionLaboral,
} from "~/types";
import { toBase64Base } from "~/utils/base64";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Nuevo Empleado" };
  },
})
export default class extends Vue {
  get isResponsive(): boolean {
    return (this as any).$vuetify.breakpoint.name === "xs";
  }

  @Ref()
  readonly form1!: HTMLFormElement;

  @Ref()
  readonly form2!: HTMLFormElement;

  @Ref()
  readonly form3!: HTMLFormElement;

  @Ref()
  readonly form4!: HTMLFormElement;

  @Ref()
  readonly form5!: HTMLFormElement;

  isLoading: boolean = false;
  isLoadingReniec: boolean = false;
  formValid: boolean[] = [true, true, true, true, true];
  step: number = 1;

  birthdayMenu: boolean = false;
  startMenu: boolean = false;
  appointmentMenu: boolean = false;
  imagen: File | null = null;
  previewPhoto: any = "";

  numni: number = 0;
  numtdi: string = "";

  employee: Partial<Empleado> = {};

  accountTypes: any[] = [];
  banks: Banco[] = [];
  workingCondition: CondicionLaboral[] = [];
  docTypes: any[] = [];
  employeeType: TipoEmpleado[] = [];
  nacionalidad: Nacionalidad[] = [];
  ochart: any[] = [];
  positions: Cargo[] = [];
  professionalColleges: ColegioProfesional[] = [];
  professions: Profesion[] = [];
  roles: Rol[] = [];

  gender: any = [
    { den: "Masculino", abbr: "M" },
    { den: "Femenino", abbr: "F" },
  ];

  maritalStatus: any[] = [];

  birthday: string = "";
  @Watch("employee.nacimiento")
  onBirthDayChange(val: string) {
    if (!val) {
      return;
    }
    const [year, month, day] = val.split("-");
    this.birthday = `${day}/${month}/${year}`;
  }

  startDate: string = "";
  @Watch("employee.fechaIngreso")
  onStartDateChange(val: string) {
    if (!val) {
      return;
    }
    const [year, month, day] = val.split("-");
    this.startDate = `${day}/${month}/${year}`;
  }

  appointmentDate: string = "";
  @Watch("employee.fechaNombramiento")
  onAppointmentDateChange(val: string) {
    if (!val) {
      return;
    }
    const [year, month, day] = val.split("-");
    this.appointmentDate = `${day}/${month}/${year}`;
  }

  async previewFile(event: File) {
    const reader = await toBase64Base(event);
    this.previewPhoto = reader;
  }

  nextPage(page: number) {
    const form = this.$refs[`form${page}`] as HTMLFormElement;
    this.formValid[page - 1] = form.validate();
    this.step++;
  }

  async dataReniec(dni: string) {
    this.isLoadingReniec = true;
    const { data } = await axios({
      url: `https://dni.optimizeperu.com/api/persons/${dni}`,
      method: "GET",
      /*       headers: { Authorization: "" },
       */
    });
    this.employee.apellidoPaterno = data.first_name;
    this.employee.apellidoMaterno = data.last_name;
    this.employee.nombres = data.name;

    this.isLoadingReniec = false;
  }

  async createEmployee() {
    this.formValid[0] = this.form1.validate();
    this.formValid[1] = this.form2.validate();
    this.formValid[2] = this.form3.validate();
    this.formValid[3] = this.form4.validate();
    this.formValid[4] = this.form5.validate();

    if (!this.formValid.includes(false)) {
      this.isLoading = true;

      await this.$axios.buildResponse({
        notify: "always",
        attempts: 1,
        request: { method: "POST", url: "/api/employee", data: this.employee },
        ifOk: () => {
          this.$router.replace("/employee");
        },
      });

      this.isLoading = false;
    }
  }

  mounted() {
    const self = this;
    this.$axios.buildResponses<any>({
      requests: [
        this.$axios.getResponse<TipoEmpleado>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/master/employee-type?itemsPerPage=-1",
          },
        }),
        this.$axios.getResponse<CondicionLaboral>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/master/working-condition?itemsPerPage=10",
          },
        }),
        this.$axios.getResponse<ColegioProfesional>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/master/professional-college?itemsPerPage=-1",
          },
        }),
        this.$axios.getResponse<Profesion>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/master/profession?itemsPerPage=10",
          },
        }),

        this.$axios.getResponse<Rol>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/role?itemsPerPage=-1",
          },
        }),
        this.$axios.getResponse<Banco>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/master/bank?itemsPerPage=-1",
          },
        }),
        this.$axios.getResponse<Nacionalidad>({
          paginated: true,
          request: {
            method: "GET",
            url: "/api/master/nationality?itemsPerPage=-1",
          },
        }),
        this.$axios.getResponse<any>({
          method: "GET",
          url: "/api/common/doc-type",
        }),
        this.$axios.getResponse<any>({
          method: "GET",
          url: "/api/common/account-type",
        }),
        this.$axios.getResponse<any>({
          method: "GET",
          url: "/api/common/marital-status",
        }),
      ],
      ifOk(result: any[]) {
        self.employeeType = result[0].items;
        self.workingCondition = result[1].items.filter(
          (x: CondicionLaboral) => x.denominacion,
        );
        self.professionalColleges = result[2].items;
        self.professions = result[3].items;
        self.roles = result[4].items;
        self.banks = result[5].items;
        self.nacionalidad = result[6].items;
        self.docTypes = result[7];
        self.accountTypes = result[8];
        self.maritalStatus = result[9].items;
      },
    });
  }
}
</script>
