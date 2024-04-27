<template lang="pug">
div
  card(v-if="manage", title="Programación")
    template(v-if="!isResponsive", v-slot:header-title)
      v-tabs.tabs(v-model="tabs")
        v-tab(v-for="(item, index) in payload.establecimientos", :key="index") {{ item.denominacion }}
    template(v-else, v-slot:header-center)
      v-select(
        v-model="tabs",
        :items="payload.establecimientos",
        item-text="denominacion",
        :item-value="(x) => payload.establecimientos.indexOf(x)",
        filled,
        dense
      )
    template(v-slot:header-end)
      v-dialog(v-model="dialog", scrollable, max-width="700")
        template(v-slot:activator="{ on, attrs }")
          v-btn.mr-3(color="primary" dark v-bind="attrs" v-on="on")
            | Turnos
        v-card
          v-card-text(style="height: 500px;")
            v-simple-table.mx-3.mt-5.mb-3
              template(v-slot:default="")
                thead
                  tr
                    th.text-left Denominacion
                    th.text-left Descripción
                    th.text-left Hora Inicio
                    th.text-left Hora Fin
                    th.text-left Total Horas
                tbody
                  tr(v-for="item in turns" :key="item.denominacion")
                    td {{ item.denominacion }}
                    td {{ item.descripcion }}
                    td {{ item.horaInicio }}
                    td {{ item.horaFin }}
                    td {{ item.horas }}
      v-btn.mr-3(
        outlined,
        color="primary",
        @click="saveShiftWork('Creado')",
        :disabled="loading || sending",
        :loading="saving"
      ) Guardar
        v-icon(right) mdi-content-save
      v-btn(
        color="primary",
        @click="saveShiftWork('Enviado')",
        :disabled="loading || saving",
        :loading="sending"
      ) Enviar
        v-icon(right) mdi-send

    v-skeleton-loader(type="table-tbody", :loading="loading")
      v-tabs-items(v-model="tabs", touchless)
        v-tab-item(
          v-for="(estab, index) in payload.establecimientos",
          :key="index",
          transition="fade-transtion"
        )
          .mb-3.text-center
            span.establishment {{ isResponsive ? 'HRA' : 'HOSPITAL REGIONAL DE AYACUCHO' }} - SEDE {{ estab.denominacion }}
            br 
            span.structure {{ payload.organigrama }}
            br
            span.period {{ month }} del {{ new Date(payload.periodo).getFullYear() }}

          v-row.my-4(justify="center")
            v-col(cols=12, md=6)
              v-autocomplete(
                filled,
                hide-details,
                placeholder="Empleados",
                item-text="nombreCompleto",
                item-value="id",
                :items="employeeData",
                @input="fillEmployee"
              )

          v-data-table.manage-table(
            ref="dataTable",
            item-key="employee.id",
            :headers="headers",
            :items="data[estab.id]",
            mobile-breakpoint="1",
            hide-default-footer,
            show-expand,
            height="50vh",
            fixed-header,
            :item-class="getItemClass",
            group-by="employee.categoria",
          )
            template(v-slot:group.header="{group}")
              td(colspan="99999")
                div.d-flex.justify-start.align-center
                  div.color-box(:style="{ backgroundColor:categoryColors[group] }")
                  b {{group}}
            template(
              v-for="n in payload.dias",
              v-slot:[`item.${n}`]="{ item }"
            )
              v-select(
                v-model="item[n].currentTurnId",
                :key="n",
                :items="item[n].currentTurnId ? payload.turnosLimpiar : payload.turnos",
                :disabled="(item[n].esRegular)",
                item-value="id",
                item-text="denominacion",
                placeholder="Elegir",
                @change="changeTurn($event, n, item, estab.id)"
              )
            template(v-slot:expanded-item="{ headers, item }")
              td.py-4(:colspan="headers.length")
                ul
                  li
                    span.key Cargo:&nbsp;
                    span.value {{ item.employee.cargo }}
                  li
                    span.key Condición:&nbsp;
                    span.value {{ item.employee.condicionLaboral.denominacion }}
                  li
                    span.key Total Horas:&nbsp;
                    span.value {{ item.employee.condicionLaboral.totalHoras }} horas
                  li
                    span.key Profesión:&nbsp;
                    span.value {{ item.employee.profesiones }}
  pagination(
    ref="pagination",
    title="Mis programaciones",
    :headers="historyHeaders",
    :params="{ boss: $auth.user.empleadoId, type: 'Complementario' }",
    :after="getMonth",
    :item-class="swClass",
    model="shift-work",
    no-action
  )
    template(v-slot:header-end="{ pagination }")
      v-btn(
        v-if="!manage && pagination.metadata.canScheduleComplementary",
        color="primary",
        @click="loadData"
      ) Programar
      div(v-else)
    template(v-slot:actions="{ item }")
      v-icon.mr-2(
        v-if="item.estado === 'Creado' || item.estado === 'Observado'",
        @click="loadData",
        small
      ) mdi-pencil
      v-icon(small, @click="$router.push(`/shift-work/view/${item.id}`)") mdi-eye
      v-btn.ml-2(
        v-if="item.estado === 'Aprobado'",
        @click="printShiftWork(item)",
        :loading="item.loading",
        small,
        icon
      )
        v-icon(small) mdi-printer
      v-tooltip(v-if="item.estado === 'Observado'", top)
        template(v-slot:activator="{ on, attrs }")
          v-icon.ml-2(v-on="on", v-bind="attrs", small, color="#AB9F0C") mdi-alert-circle
        span
          b Observación:
          br
          | {{ item.observacion }}
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { commonStore } from "~/store";
import {
  AlertType,
  Categoria,
  Empleado,
  EmpleadoSW,
  Establecimiento,
  OChart,
  RolTurno,
  RolTurnoDetalle,
  RolTurnoEstab,
  ShiftWorkVm,
  Turno,
} from "~/types";

interface Payload {
  establecimientos: Establecimiento[];
  empleados: EmpleadoSW[];
  turnos: Required<Turno>[];
  turnosLimpiar: Required<Turno>[];
  dias: number;
  periodo: string;
  periodoActual: string;
  organigrama: OChart;
  rolTurno: Required<RolTurno> | null;
  rolTurnoEstabs: Required<RolTurnoEstab>[];
  detalles: RolTurnoDetalle[];
  detallesDeshabilitados: RolTurnoDetalle[];
  categorias: Categoria[];
}
interface Data {
  employee: EmpleadoSW;
  hasFailed: { value: boolean };
  totalHours: { value: number };
  [day: number]: {
    currentTurnId: number | undefined;
    oldTurnId: number | undefined;
    esRegular?: boolean;
  };
}

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Horas Complementarias" };
  },
})
export default class ShiftWorkPage extends Vue {
  get isResponsive(): boolean {
    return (this as any).$vuetify.breakpoint.name === "xs";
  }

  @Ref()
  readonly pagination!: any;

  payload: Partial<Payload> = {};
  details: RolTurnoDetalle[] = [];
  disabledDetails: RolTurnoDetalle[] = [];

  month: string = "";

  loading: boolean = false;
  saving: boolean = false;
  sending: boolean = false;
  tabs: number | null = null;
  manage = false;
  dialog: boolean = false;

  data: Record<number, Data[]> = {};
  employeeData: any[] = [];
  turns: any[] = [];
  turnHours!: Map<number, number>;

  categoryColors: any = {};

  headers: any[] = [];

  historyHeaders: any = [
    { text: "ID", value: "id", width: 75 },
    {
      text: "Estructura Orgánica",
      value: "organigrama.denominacion",
      width: 400,
    },
    { text: "Mes", value: "mes" },
    { text: "Año", value: "ano" },
    { text: "Fecha", value: "fecha" },
    { text: "Estado", value: "estado" },
    { text: "Acciones", value: "actions", sortable: false, align: "center" },
  ];

  getPeriod(date: string) {
    const now = new Date(date);
    return `${now.toLocaleString("es-es", {
      month: "long",
    })} del ${now.getFullYear()}`;
  }

  makeMonth(now: Date) {
    const month = now.toLocaleString("es-es", { month: "long" });
    return month.charAt(0).toUpperCase() + month.slice(1);
  }

  getMonth(sw: Required<RolTurno>) {
    const now = new Date(sw.anio, (sw.mes as number) - 1);
    sw.mes = this.makeMonth(now);
    (sw as any).loading = false;
    (sw as any).fecha = new Date(sw.fechaMod ?? sw.fechaReg).toLocaleString(
      "es-es",
    );
  }

  changeTurn(
    turnId: number | undefined,
    day: number,
    data: Data,
    establishmentId: number,
  ) {
    if (turnId === undefined || turnId <= 0) {
      const oldId = data[day].oldTurnId;
      data[day].currentTurnId = undefined;

      const oldDetailIndex = this.details.findIndex(
        (details) =>
          details.empleadoId === data.employee.id &&
          details.dia === day &&
          details._estabId === establishmentId,
      );

      if (oldDetailIndex >= 0 && oldId !== undefined) {
        data.totalHours.value -= this.turnHours.get(oldId) ?? 0;
        this.details.splice(oldDetailIndex, 1);
      }

      return;
    }

    const newTurnHours = this.turnHours.get(turnId) ?? 0;
    const currentDetail = this.details.find(
      (details) =>
        details.empleadoId === data.employee.id &&
        details.dia === day &&
        details._estabId === establishmentId,
    );

    if (currentDetail !== undefined) {
      const oldTurnHours = this.turnHours.get(currentDetail.turnoId) ?? 0;
      data.totalHours.value =
        data.totalHours.value - oldTurnHours + newTurnHours;
      currentDetail.turnoId = turnId;
    } else {
      data.totalHours.value += newTurnHours;
      this.details.push({
        empleadoId: data.employee.id,
        turnoId: turnId,
        dia: day,
        _estabId: establishmentId,
      });
    }

    data[day].oldTurnId = turnId;

    if (
      data.hasFailed &&
      data.totalHours.value >= data.employee.condicionLaboral.totalHoras
    ) {
      data.hasFailed.value = false;
      for (const dt of this.$refs.dataTable as any) {
        dt.itemClass(data);
      }
    }
  }

  getItemClass(item: Data) {
    if (item.hasFailed.value) {
      return "failed-row";
    }
    return "";
  }

  swClass(item: any) {
    if (item.estado === "Enviado") {
      return "item-enviado";
    } else if (item.estado === "Observado") {
      return "item-observado";
    }
    return undefined;
  }

  async saveShiftWork(status: "Creado" | "Enviado") {
    const failed: EmpleadoSW[] = [];

    for (const es in this.data) {
      const items = this.data[es];

      if (items.length === 0) {
        commonStore.showAlert({
          type: AlertType.Error,
          message:
            "Asegúrese de programar horas complementarias para al menos un empleado",
        });
        return;
      }

      for (const d of items) {
        if (d.totalHours.value <= 0) {
          d.hasFailed.value = true;
          failed.push(d.employee);
        }
      }

      break;
    }

    if (failed.length > 0) {
      commonStore.showAlert({
        type: AlertType.Error,
        message: `Los emplados no tienen horas asignadas: ${failed
          .map((e) => e.nombreCompleto)
          .join(", ")}`,
      });
      (this.$refs.dataTable as any)[0].$forceUpdate();
      return;
    }

    if (status === "Enviado") {
      this.sending = true;
    } else {
      this.saving = true;
    }

    const helper = this.details.map((d) => d._estabId);
    const requestData: ShiftWorkVm = {
      tipoRolTurno: "Complementario",
      estado: status,
      estabDetalles: [...new Set(helper)].map((estabId) => ({
        establecimientoId: estabId,
        detalles: this.details.filter((d) => d._estabId === estabId),
      })),
    };

    await this.$axios.buildResponse({
      notify: "always",
      request: {
        method: "POST",
        url: "/api/shift-work",
        data: requestData,
      },
      ifOk: () => {
        this.pagination._getPage();
        this.manage = false;
      },
    });

    if (status === "Enviado") {
      this.sending = false;
    } else {
      this.saving = false;
    }
  }

  printShiftWork(sw: any) {
    sw.loading = true;
    this.$axios.buildResponse<any>({
      attempts: 1,
      request: {
        method: "GET",
        url: `/api/common/shift-work/${sw.id}/print`,
      },
      ifOk: ({ payload }) => {
        sw.loading = false;
        window.open(payload.url, "_blank");
      },
    });
  }

  fillEmployee(id: number) {
    const idx = this.employeeData.findIndex((e) => e.id === id);
    const item = this.employeeData[idx];

    for (const key in this.data) {
      this.data[key].push(item[key]);
    }

    this.employeeData.splice(idx, 1);
  }

  loadData() {
    this.manage = this.loading = true;

    this.$axios.buildResponse<Payload>({
      request: {
        method: "GET",
        url: "/api/shift-work/manage",
        params: {
          type: "Complementario",
        },
      },
      ifOk: ({ payload }) => {
        payload.empleados.forEach((e) => {
          e.profesiones = e.profesion?.denominacion ?? "Sin registro";
        });

        payload.turnosLimpiar = [
          {
            id: 0,
            denominacion: "Borrar",
            descripcion: "Borrar este turno",
            horas: 0,
            horaInicio: 0,
          },
          ...payload.turnos,
        ];

        this.payload = payload;

        const arr = Array.from({ length: payload.dias }, (_, x) => x + 1);

        const totalHours = Object.fromEntries(
          payload.empleados.map((e) => [e.id, { value: 0 }]),
        );

        const hasFailed = Object.fromEntries(
          payload.empleados.map((e) => [e.id, { value: false }]),
        );

        this.data = Object.fromEntries(
          payload.establecimientos.map((es) => [es.id, []]),
        );

        this.employeeData = payload.empleados.map((e) => ({
          ...e,
          ...Object.fromEntries(
            payload.establecimientos.map((s) => [
              s.id,
              {
                employee: e,
                totalHours: totalHours[e.id],
                hasFailed: hasFailed[e.id],
                ...Object.fromEntries(
                  arr.map((a) => [
                    a,
                    { currentTurnId: undefined, oldTurnId: undefined },
                  ]),
                ),
              },
            ]),
          ),
        }));

        this.turnHours = new Map(payload.turnos.map((t) => [t.id, t.horas]));

        if (payload.detalles.length > 0) {
          payload.detalles.forEach((pd) => {
            pd.id = undefined;
          });

          const establishments = new Map(
            payload.rolTurnoEstabs.map((rte) => [
              rte.id,
              payload.establecimientos.find(
                (es) => es.id === rte.establecimientoId,
              )!.id!,
            ]),
          );

          const employeeHelper = new Map<number, number>();

          for (const d of payload.detalles) {
            const estabId = establishments.get(d.rolTurnoEstabId!)!;
            d._estabId = estabId;

            // Find the index of the employee associated with the detail
            const employeeIdx = this.employeeData.findIndex(
              (x: Empleado) => x.id === d.empleadoId,
            );

            // Check if the employee exists in the list
            if (employeeIdx >= 0) {
              const employee = this.employeeData[employeeIdx];

              const dataTableItem = employee[estabId];
              dataTableItem[d.dia] = {
                currentTurnId: d.turnoId,
                oldTurnId: d.turnoId,
                esRegular: false,
              };
              dataTableItem.totalHours.value +=
                this.turnHours.get(d.turnoId) ?? 0;

              if (!employeeHelper.has(employee.id)) {
                for (const key in this.data) {
                  this.data[key].push(employee[key]);
                }

                employeeHelper.set(employee.id, employeeIdx);
              }
            }
          }

          if (payload.detallesDeshabilitados.length < 0) {
            employeeHelper.forEach((idx) => {
              this.employeeData.splice(idx, 1);
            });
          }

          this.details = payload.detalles;
        }

        if (payload.detallesDeshabilitados.length > 0) {
          payload.detallesDeshabilitados.forEach((pd) => {
            pd.id = undefined;
          });

          // RolTurnoEstab.Id -> Establecimiento.id
          const establishments = new Map(
            payload.rolTurnoEstabs.map((rte) => [
              rte.id,
              payload.establecimientos.find(
                (es) => es.id === rte.establecimientoId,
              )!.id!,
            ]),
          );

          // [[1,1], [2,2]]

          // Empleado.Id => employeeIndex
          // const employeeHelper = new Map<number, number>();

          for (const d of payload.detallesDeshabilitados) {
            // Find establishmentId for each detail
            const estabId = establishments.get(d.rolTurnoEstabId!)!;
            d._estabId = estabId;

            const employeeIdx = this.employeeData.findIndex(
              (x: Empleado) => x.id === d.empleadoId,
            );

            if (employeeIdx >= 0) {
              const employee = this.employeeData[employeeIdx];

              const dataTableItem = employee[estabId];

              dataTableItem[d.dia] = {
                currentTurnId: d.turnoId,
                oldTurnId: d.turnoId,
                esRegular: true,
              };

              /*               if (!employeeHelper.has(employee.id)) {
                // Iterate in the keys of an object
                for (const estabId in this.data) {
                  if (!this.data[estabId].includes(employee[estabId])) {
                    this.data[estabId].push(employee[estabId]);
                  }
                }

                employeeHelper.set(employee.id, employeeIdx);
              } */
            }
          }

          /*           employeeHelper.forEach((value , key) => {
            this.employeeData.splice(value, 1);
          });
 */
          this.disabledDetails = payload.detallesDeshabilitados;
        }

        const period = new Date(payload.periodo);
        this.month = this.makeMonth(period);

        /* 
        if (payload.rolTurno) {
          const shiftWorkPeriod = new Date(
            payload.rolTurno.ano,
            (payload.rolTurno.mes as number) - 1,
            1,
          );
          this.month = this.makeMonth(shiftWorkPeriod);
        }
 */
        this.categoryColors = Object.fromEntries(
          payload.categorias.map((c: any) => [c.denominacion, c.color]),
        );

        this.headers = [
          { text: "N° documento", value: "employee.numeroDoc" },
          { text: "Apellidos y Nombres", value: "employee.nombreCompleto" },
          ...arr.map((x) => ({
            text: x,
            value: x,
            sortable: false,
            width: 100,
            align: "center",
          })),
          {
            text: "Total Horas",
            value: "totalHours.value",
            align: "center",
          },
        ];

        this.tabs = 0;
        this.loading = false;
      },
      ifErr: () => {
        this.$router.replace("/");
      },
    });

    this.$axios.buildResponse<any>({
      request: { method: "GET", url: "/api/common/turns" },
      paginated: false,
      ifOk: ({ payload }) => {
        this.turns = payload.map((p: any) => {
          if (p.horaInicio) {
            const time = p.horaInicio ? p.horaInicio.split(":") : "";
            const startHour = new Date(2000, 0, 1, time[0], time[1], time[2]);
            p.horaInicio = startHour.toLocaleTimeString("es-PE");
            startHour.setHours(startHour.getHours() + p.horas);
            p.horaFin = startHour.toLocaleTimeString();
          }
          return p;
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

.key {
  font-family: "Encode Sans Semi Condensed", sans-serif;
  letter-spacing: 1px;
  font-weight: 600;
}
.value {
  font-family: "Encode Sans Semi Condensed", sans-serif;
}
.tabs {
  width: unset !important;
}
.failed-row {
  background-color: #f2ccc1 !important;
}
.item-enviado {
  background-color: #aed0f3;
}
.item-observado {
  background-color: #eef7bb;
}
.color-box {
  border-radius: 8px;
  border: 1px solid black;
  width: 25px;
  height: 25px;
  margin-right: 12px;
}
</style>
