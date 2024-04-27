<template lang="pug">
v-row(fluid, no-gutters)
  v-col(cols=12, md=6)
    pagination(
      :headers="headersOrganizationChart",
      model="master/organization-chart",
      title="Organigrama"
    )    
    pagination(
      :headers="headersEmployeeType",
      model="master/employee-type",
      title="Tipos de Empleado"
    )    
    pagination(
      :headers="headersContractType",
      model="master/working-condition",
      title="Tipos de Contrato"
    )
    pagination(
      :headers="headersProfession",
      model="master/profession",
      title="Profesiones"
    )
  v-col(cols=12, md=6)
    pagination(
      :headers="headersConceptoPlanillaType",
      model="master/concepto-planilla",
      title="Conceptos de Planilla"
    )
    pagination(
      :headers="headersProfessionalCollege",
      model="master/professional-college",
      title="Colegios Profesionales"
    )
    pagination(
      :headers="headersPosition",
      model="master/position",
      title="Cargos"
    )
    pagination(:headers="headersBanco", model="master/bank", title="Banco")
    pagination(:headers="headersTurn", model="master/turn", title="Turnos")
</template>
<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Maestros" };
  },
})
export default class MasterPage extends Vue {
  headersEmployeeType: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
  
  headersConceptoPlanillaType: any = [
    { text: "ID", value: "id" },
    { text: "Codigo", value: "codigo" },
    { text: "Abreviado", value: "abreviado" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Tipo", value: "tipo" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersContractType: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersOrganizationChart: any = [
    { text: "ID", value: "id" },
    { text: "Nombre", value: "nombre" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersPosition: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersTurn: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Descripcion", value: "descripcion" },
    { text: "Horas", value: "horas" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersProfessionalCollege: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Direccion", value: "direccion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersProfession: any = [
    { text: "ID", value: "id" },
    { text: "Denominacion", value: "denominacion" },
    { text: "Acciones", value: "actions", sortable: false },
  ];

  headersBanco: any = [
    { text: "ID", value: "id" },
    { text: "Nombre", value: "nombre" },
    { text: "Acciones", value: "actions", sortable: false },
  ];
}
</script>
