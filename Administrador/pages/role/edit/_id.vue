<template lang="pug">
card(title="Editar Rol")
  template(v-slot:header-end)
    v-btn(color="primary", :loading="isLoading", @click="updateRole") Guardar
  v-form(ref="editRoleForm")
    v-row(justify="center")
      v-col.text-center(cols=12, md=6)
        v-text-field(
          v-model="role.denominacion",
          :rules="requiredRule",
          label="Denominacion",
          filled
        )
        v-text-field(v-model="role.descripcion", label="Descripcion", filled)
      v-col(cols=12, md=6)
        .list-box
          v-list
            v-subheader(dense) PERMISOS DEL SISTEMA
            v-list-group(
              v-for="(menu, idx) in menus",
              :key="idx",
              :prepend-icon="menu.icono",
              no-action
            )
              template(v-slot:activator)
                v-list-item-title {{ menu.nombre }}
                v-checkbox(
                  :ripple="false",
                  @click.stop,
                  :indeterminate="menu.state === 'some'",
                  :input-value="menu.state === 'some' || menu.state === 'all'",
                  @change="selectMenu($event, menu)"
                )

              v-list-group(
                v-for="(submenu, idx0) in menu.submenus",
                :key="idx0",
                sub-group,
                no-action
              )
                template(v-slot:activator)
                  v-list-item-title {{ submenu.nombre }}
                  v-checkbox.cbx(
                    :ripple="false",
                    @click.stop,
                    :indeterminate="submenu.state === 'some'",
                    :input-value="submenu.state === 'some' || submenu.state === 'all'",
                    @change="selectSubmenu($event, submenu, menu)"
                  )

                v-list-item(
                  v-for="(permiso, idx1) in submenu.permisos",
                  :key="idx1"
                )
                  v-list-item-title {{ permiso.descripcion ? permiso.descripcion : permiso.nombre }}
                  v-checkbox.cbx(
                    v-model="permiso.state",
                    @change="selectPermission($event, permiso, [submenu, menu])"
                  )

      v-col(cols=2, md=1, v-if="false")
        v-btn(icon, @click="selectAll")
          v-icon mdi-checkbox-marked
        v-btn(icon, @click="unselectAll")
          v-icon mdi-checkbox-blank-outline
        v-btn(icon, @click="$refs.rolTreeview.updateAll(true)")
          v-icon mdi-chevron-down
        v-btn(icon, @click="$refs.rolTreeview.updateAll(false)")
          v-icon mdi-chevron-up
</template>

<script lang="ts">
import { Vue, Component, Ref } from "nuxt-property-decorator";
import { Permiso, Rol } from "~/types";

interface Permission extends Permiso {
  state: boolean;
}
interface Submenu {
  nombre: string;
  permisos: Permission[];
  state: CbxState;
}
interface MenuWP {
  nombre: string;
  icono: string;
  submenus: Submenu[];
  state: CbxState;
}

type CbxState = "all" | "some" | "none";

@Component({
  layout: "app",
  // Head configuration.
  head() {
    return { title: "Editar Rol" };
  },
})
export default class extends Vue {
  @Ref()
  readonly editRoleForm!: HTMLFormElement;

  isLoading: boolean = false;

  role: Rol = {
    denominacion: "",
    descripcion: "",
    permisos: [],
  };

  menus: MenuWP[] = [];
  selection: any[] = [];

  setSelectionIds = new Set<number>();

  selectAll() {
    // this.selection = this.menus.flatMap((x) => x.permiso);
  }

  unselectAll() {
    this.selection = [];
  }

  checkMenu(menu: MenuWP) {
    const smCount = menu.submenus.length;
    const asmCount = menu.submenus.filter((x) => x.state === "all").length;
    const ssmCount = menu.submenus.filter((x) => x.state === "some").length;

    menu.state =
      asmCount === 0 && ssmCount === 0
        ? "none"
        : asmCount === smCount
        ? "all"
        : "some";
  }

  selectMenu(state: boolean, mwp: MenuWP) {
    for (const item of mwp.submenus) {
      this.selectSubmenu(state, item);
    }
  }

  checkSubmenu(submenu: Submenu) {
    const pCount = submenu.permisos.length;
    const apCount = submenu.permisos.filter((x) => x.state).length;

    submenu.state = apCount === 0 ? "none" : apCount < pCount ? "some" : "all";
  }

  selectSubmenu(state: boolean, submenu: Submenu, menu?: MenuWP) {
    for (const permission of submenu.permisos) {
      this.selectPermission(state, permission);
      permission.state = state;
    }
    submenu.state = state ? "all" : "none";

    if (menu) {
      this.checkMenu(menu);
    }
  }

  selectPermission(
    state: boolean,
    permission: Permission,
    parents?: [Submenu, MenuWP],
  ) {
    if (typeof permission.id === "number") {
      if (state) {
        this.setSelectionIds.add(permission.id);
      } else {
        this.setSelectionIds.delete(permission.id);
        // permission.parent.state = permission.parent.parent.state = "some";
      }

      if (parents) {
        this.checkSubmenu(parents[0]);
        this.checkMenu(parents[1]);
      }
    }
  }

  async updateRole() {
    if (this.editRoleForm.validate()) {
      this.isLoading = true;

      this.role.permisos = Array.from(this.setSelectionIds);

      await this.$axios.buildResponse({
        notify: "always",
        request: {
          method: "PUT",
          url: `/api/role/${this.$route.params.id}`,
          data: this.role,
        },
        ifOk: () => {
          this.$router.replace("/role");
        },
      });

      this.isLoading = false;
    }
  }

  async mounted() {
    const { data } = await this.$axios.get(
      `/api/role/${this.$route.params.id}`,
    );
    this.role = data;

    const response2 = await this.$axios.get(
      `/api/common/role/${this.$route.params.id}/permissions`,
    );

    const response0 = await this.$axios.get("/api/common/menu/permissions");
    const _menus: MenuWP[] = response0.data;
    for (const m of _menus) {
      m.state = "none";
      for (const sm of m.submenus) {
        sm.state = "none";
        for (const p of sm.permisos) {
          const permissionIds = (response2.data as Permission[]).map((x) =>
            Number(x.id),
          );
          for (const item of permissionIds) {
            this.setSelectionIds.add(item);
          }

          p.state = this.setSelectionIds.has(Number(p.id));
        }
        this.checkSubmenu(sm);
      }
      this.checkMenu(m);
    }
    this.menus = _menus;
    // console.log(this.menus);

    const response1 = await this.$axios.get(`/api/permission`);
    this.selection = response1.data.items;
  }
}
</script>

<style scoped, lang="scss">
.list-box {
  height: 50vh;
  padding: 0px 8px;
  border: 0.75px solid #d9d9d9;
  border-radius: 6px;
  overflow-y: auto;

  & .v-input__slot {
    margin: 0px !important;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 6px;
  }
  & .cbx {
    margin-right: 40px;
  }
  & .v-list-group__header__append-icon {
    min-width: 24px !important;
  }
}
</style>
