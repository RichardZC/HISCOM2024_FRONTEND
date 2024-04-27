<template lang="pug">
card(title="Vista General")
  template(v-if="!isResponsive", v-slot:header-title)
    v-tabs.tabs(
      v-if="payload.rolTurnoEstabs && payload.rolTurnoEstabs.length > 1",
      v-model="tabs"
    )
      v-tab(v-for="(item, index) in payload.rolTurnoEstabs", :key="index") {{ item.establecimiento.denominacion }}
  template(v-else, v-slot:header-center)
    v-select(
      v-model="tabs",
      :items="payload.rolTurnoEstabs",
      item-text="establecimiento.denominacion",
      :item-value="(x) => payload.rolTurnoEstabs.indexOf(x)",
      filled,
      dense
    )

  template(v-if="payload.esSiguienteAprobador", v-slot:header-end)
    .text-right
      v-dialog(v-model="dialogReject", persistent, max-width="400")
        template(v-slot:activator="{ on, attrs }")
          v-btn.mr-2(
            v-if="isResponsive",
            v-bind="attrs",
            v-on="on",
            color="#B20D21",
            dark
          ) 
            v-icon mdi-close
          v-btn.mr-2(v-else, v-bind="attrs", v-on="on", color="#B20D21", dark) Rechazar

        v-card
          .px-4.pt-6
            v-form(ref="rejectForm")
              v-textarea(
                v-model="shiftWork.observacion",
                filled="",
                label="Observación*",
                auto-grow,
                :rules="requiredRule"
              )
          v-card-actions
            v-spacer
            v-btn(color="primary", text, @click="dialogReject = false") Cancelar
            v-btn(
              color="primary",
              text,
              @click="updateShiftWork(false)",
              :loading="modalLoading"
            ) Guardar
      v-dialog(v-model="dialogAccept", persistent="", max-width="400")
        template(v-slot:activator="{ on, attrs }")
          v-btn(
            v-if="isResponsive",
            v-bind="attrs",
            v-on="on",
            color="primary",
            icon
          )
            v-icon mdi-check
          v-btn(v-else, v-bind="attrs", v-on="on", color="primary") Aprobar
        v-card
          v-card-text.text-center.pt-6
            | ¿Está seguro de aprobar el rol de turnos {{ payload.tipo === 'Complementario' ? 'de horas complementarias' : '' }} del/de la&nbsp;
            b(style="text-transform: uppercase") {{ payload.organigrama }}
            | &nbsp;para el periodo&nbsp;
            b {{ getPeriod(payload.periodo) }}
            | ?
          v-card-actions
            v-spacer
            v-btn(color="primary", text, @click="dialogAccept = false") Cancelar
            v-btn(
              color="primary",
              text,
              @click="updateShiftWork(true)",
              :loading="modalLoading"
            ) Guardar

  v-skeleton-loader(type="table-tbody", :loading="loading")
    template(v-slot:default, v-if="payload")
      v-tabs-items(
        v-if="payload.rolTurnoEstabs.length > 1",
        v-model="tabs",
        touchless
      )
        v-tab-item(
          v-for="(rtEstab, index) in payload.rolTurnoEstabs",
          :key="index",
          transition="fade-transtion"
        )
          .mb-3.text-center
            span.establishment {{ isResponsive ? 'HRA' : 'HOSPITAL REGIONAL DE AYACUCHO' }} - SEDE {{ rtEstab.establecimiento.denominacion }}
            br 
            span.structure {{ payload.organigrama }}
            br
            span.period {{ getPeriod(payload.periodo) }}
          v-data-table.manage-table(
            ref="dataTable",
            :items="items[rtEstab.id]",
            item-key="employee.id",
            :headers="headers",
            mobile-breakpoint="1",
            hide-default-footer,
            height="50vh",
            fixed-header,
            group-by="employee.categoria",
          )
            template(v-slot:group.header="{group}")
              td(colspan="99999")
                div.d-flex.justify-start.align-center
                  div.color-box(:style="{ backgroundColor:categoryColors[group] }")
                  b {{group}}
      div(v-else-if="payload.rolTurnoEstabs.length === 1")
        .mb-3.text-center
          span.establishment HOSPITAL REGIONAL DE AYACUCHO - SEDE {{ payload.rolTurnoEstabs[0].establecimiento.denominacion }}
          br 
          span.structure {{ payload.organigrama }}
          br
          span.period {{ getPeriod(payload.periodo) }}
        v-data-table.manage-table(
          ref="dataTable",
          :items="items[payload.rolTurnoEstabs[0].id]",
          item-key="employee.id",
          :headers="headers",
          mobile-breakpoint="1",
          hide-default-footer,
          height="50vh",
          fixed-header,
          group-by="employee.categoria",
        )
          template(v-slot:group.header="{group}")
            td(colspan="99999")
              div.d-flex.justify-start.align-center
                div.color-box(:style="{ backgroundColor:categoryColors[group] }")
                b {{group}}
      div(v-else)
        span Información no disponible
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { hiscomStore } from "~/store";
import {
  Categoria,
  Empleado,
  RolTurno,
  RolTurnoEstab,
  RolTurnoTipo,
  Turno,
} from "~/types";

interface Payload {
  organigrama: string;
  mes: number;
  ano: number;
  turnos: Required<Turno>[];
  dias: number;
  empleados: Empleado[];
  rolTurnoEstabs: Required<RolTurnoEstab>[];
  categorias: Categoria[];
  tipo: RolTurnoTipo;

  controlRolTurno: boolean;
  direccionRolTurno: boolean;
}

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Rol de Turnos" };
  },
})
export default class ShiftWorkPage extends Vue {
  get isResponsive(): boolean {
    return (this as any).$vuetify.breakpoint.name === "xs";
  }

  @Ref()
  readonly rejectForm!: HTMLFormElement;

  payload: Partial<Payload> = {};
  tabs: number | null = null;
  items: Record<number, any[]> = {};

  loading: boolean = true;
  modalLoading: boolean = false;
  dialogAccept: boolean = false;
  dialogReject: boolean = false;

  categoryColors: any = {};

  headers: any[] = [
    { text: "N° documento", value: "employee.numeroDoc" },
    {
      text: "Apellidos y Nombres",
      value: "employee.nombreCompleto",
      width: 300,
    },
  ];

  shiftWork: Partial<RolTurno> = {};

  getPeriod(date: string) {
    const now = new Date(date);
    return `${now.toLocaleString("es-es", {
      month: "long",
    })} del ${now.getFullYear()}`;
  }

  async updateShiftWork(isAccept: boolean) {
    if (!isAccept && !this.rejectForm.validate()) {
      return;
    }

    this.modalLoading = true;

    await this.$axios.buildResponse({
      notify: "always",
      request: {
        method: "PUT",
        url: "/api/shift-work/review",
        data: {
          id: this.$route.params.id,
          estado: isAccept ? "Aprobado" : "Observado",
          observacion: this.shiftWork.observacion,
        },
      },
      ifOk: () => {
        this.$router.replace("/shift-work/review");
      },
    });

    this.modalLoading = false;
  }

  mounted() {
    this.$axios.buildResponse<Payload>({
      request: {
        method: "GET",
        url: `/api/common/shift-work/${this.$route.params.id}`,
      },
      ifOk: ({ payload }) => {
        const turns = new Map(
          payload.turnos.map((t) => [t.id, t.denominacion]),
        );

        const turnHours = new Map(payload.turnos.map((t) => [t.id, t.horas]));
        const arr = Array.from({ length: payload.dias }, (_, x) => x + 1);

        this.tabs = 0;

        for (const rte of payload.rolTurnoEstabs) {
          this.items[rte.id] = [];

          for (const e of payload.empleados) {
            let totalHours = 0;

            const details = rte.rolTurnoDetalle
              .filter((rtd) => rtd.empleadoId === e.id)
              .map((rtd) => {
                totalHours += turnHours.get(rtd.turnoId) ?? 0;
                return [rtd.dia, turns.get(rtd.turnoId)];
              });

            if (totalHours > 0) {
              this.items[rte.id].push({
                employee: e,
                ...Object.fromEntries(details),
                totalHoras: totalHours,
              });
            }
          }
        }

        if (payload.tipo === "Complementario") {
          hiscomStore.mutateTitle("Horas Complementarias");
        }

        this.categoryColors = Object.fromEntries(
          payload.categorias.map((c: any) => [c.denominacion, c.color]),
        );

        this.headers.push(
          ...arr.map((x) => ({
            text: x,
            value: String(x),
            sortable: false,
            width: 25,
            align: "center",
          })),
          {
            text: "Total Horas",
            value: "totalHoras",
            align: "center",
          },
        );
        this.payload = payload;

        this.$nextTick(() => {
          this.loading = false;
        });
      },
      ifErr: () => {
        this.$router.replace("/");
      },
    });
  }
}
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Encode+Sans+Semi+Condensed:wght@300;400;500;600;700&display=swap");
.manage-table th,
.manage-table td {
  white-space: nowrap !important;
}
.manage-table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.establishment {
  font-weight: 500;
  font-size: 18px;
  font-family: "Encode Sans Semi Condensed", sans-serif;
  text-transform: uppercase;
}
.structure {
  font-weight: 500;
  font-size: 16px;
  font-family: "Encode Sans Semi Condensed", sans-serif;
  letter-spacing: 1px;
}
.period {
  font-weight: 400;
  font-size: 14px;
  font-family: "Encode Sans Semi Condensed", sans-serif;
  text-transform: capitalize;
}

@media only screen and (max-width: 600px) {
  .establishment {
    font-size: 14px;
  }
  .structure {
    font-size: 14px;
  }
  .period {
    font-size: 14px;
  }
}

.tabs {
  width: unset !important;
}
.key {
  font-family: "Encode Sans Semi Condensed", sans-serif;
  letter-spacing: 1px;
  font-weight: 600;
}
.value {
  font-family: "Encode Sans Semi Condensed", sans-serif;
}
.color-box {
  border-radius: 8px;
  border: 1px solid black;
  width: 25px;
  height: 25px;
  margin-right: 12px;
}
</style>
