<template lang="pug">
v-app
  v-alert.app-alert.mx-3.mx-sm-6.mx-md-8(
    v-model="isAlert",
    :class="{ 'r__app-alert': isResponsive }",
    :icon="aPayload.icon",
    :type="aPayload.type",
    dismissible
  )
    div(v-html="aPayload.message")
  v-snackbar.app-snackbar(
    v-model="isSnackbar",
    :bottom="sPayload.align === 'bottom'",
    :color="sPayload.color",
    :left="sPayload.align === 'left'",
    :right="sPayload.align === 'right'",
    :timeout="sPayload.timeout",
    :top="sPayload.align === 'top'"
  ) {{ sPayload.message }}
    template(v-slot:action="{ attrs }")
      v-btn(v-bind="attrs", @click="isSnackbar = false", icon)
        v-icon mdi-close

  v-app-bar(app, clipped-left, color="primary", dark, fixed, flat)
    //- Responsivity: logo image
    v-list-item-avatar(v-if="!isResponsive", min-width=120, tile, width=120)
      nuxt-link(to="/") 
        img(:src="require('@/assets/logo.jpg')", style="width: 120px")
    v-btn(@click.stop="maximize", icon)
      //- Responsivity: app bar button icon
      v-icon {{ isResponsive ? 'mdi-menu' : `mdi-chevron-${miniVariant ? 'right' : 'left'}` }}
    v-list-item-avatar.mr-2(
      v-if="isResponsive",
      height="auto",
      min-width="100",
      tile,
      width="100"
    )
      img(:src="require('@/assets/logo.jpg')")
    v-toolbar-title(v-text="title")
    v-spacer

    v-menu(activator="#v_notification", offset-y)

    v-list-item-avatar#r_v_menu(v-if="isResponsive", color="black", size="40")
      v-img(
        :src="user.foto ? user.foto : require('~/assets/employees/user-placeholder.png')"
      )
      v-menu(activator="#r_v_menu", close-on-content-click, offset-y)
        v-list
          v-list-item(to="/manage-profile/profile")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-content
              v-list-item-title Perfil
          v-list-item
            v-list-item-icon
              v-icon mdi-cog-outline
            v-list-item-content
              v-list-item-title Configuración
          v-divider
          v-list-item(@click.stop="logout")
            v-list-item-icon
              v-icon mdi-exit-to-app
            v-list-item-content
              v-list-item-title Cerrar sesión

    #v_menu.header-user__container.d-flex.justify-end.align-center(v-else)
      v-list-item-avatar.py-0.ml-3.my-0.mr-0(color="black", size="40")
        v-img(
          :src="user.foto ? user.foto : require('~/assets/employees/user-placeholder.png')"
        )
      .header-user.ma-0.px-3
        span {{ user.nombreUsuario }}
        br
        span {{ user.correo }}
      v-menu(activator="#v_menu", close-on-content-click, offset-y)
        v-list
          v-list-item(to="/manage-profile/profile")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-content
              v-list-item-title Perfil
          v-list-item
            v-list-item-icon
              v-icon mdi-cog-outline
            v-list-item-content
              v-list-item-title Configuración
          v-divider
          v-list-item(@click.stop="logout")
            v-list-item-icon
              v-icon mdi-exit-to-app
            v-list-item-content
              v-list-item-title Cerrar sesión

  v-navigation-drawer(
    v-model="drawer",
    :class="{ 'no-scrollbar': miniVariant }",
    :expand-on-hover="!isResponsive && expandHover",
    :fixed="isResponsive",
    :mini-variant="!isResponsive && miniVariant",
    :temporary="isResponsive",
    app,
    clipped,
    disable-resize-watcher,
    height="100vh",
    mobile-breakpoint="1"
  )
    //-template(v-slot:prepend)
      v-list-item(two-line)
        v-list-item-avatar(tile, size="24")
          img(
            src="https://cdn3.iconfinder.com/data/icons/clinical-3/96/medical-history-512.png"
          )
        v-list-item-content
          v-list-item-title HISCOM
          v-list-item-subtitle Proyecto de software
    v-divider 
    v-list
      div(v-for="item in navItems", :key="item.id")
        v-list-group(
          v-if="item.permiso",
          :prepend-icon="item.icono",
          no-action
        )
          template(v-slot:activator)
            v-list-item-content
              v-list-item-title(v-text="item.nombre")
          v-list-item(
            v-for="child in item.permiso",
            :key="child.id",
            :to="child.ruta",
            exact
          )
            v-list-item-content
              v-list-item-title(v-text="child.nombre")
        v-list-item(v-else, :to="item.ruta", exact, router)
          v-list-item-action
            v-icon {{ item.icono }}
          v-list-item-content
            v-list-item-title(v-text="item.nombre")
  v-main
    v-container(fluid)
      nuxt
  //- v-footer(app)
  //-   span &copy; {{ new Date().getFullYear() }}
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { commonStore, hiscomStore } from "~/store";
import { AlertMutation, AlertType, Align, SnackbarMutation } from "~/types";

interface Menu {
  id?: number;
  nombre: string;
  icono: string;
  ruta?: string;
  permiso: Permiso[];
}

interface Permiso {
  accion: string;
  controlador: string;
  descripcion: string;
  id: number;
  menuId: number;
  nombre: string;
  protegido: boolean;
  ruta: string;
  visible: boolean;
}

@Component
export default class AppLayout extends Vue {
  get isResponsive(): boolean {
    return (this as any).$vuetify.breakpoint.name === "xs";
  }

  @Watch("isResponsive")
  onResponsiveChange(val: boolean) {
    if (!val) {
      this.drawer = true;
    }
  }

  drawer: boolean = !this.isResponsive;
  miniVariant: boolean = true;
  expandHover: boolean = true;

  navItems: Menu[] = [];
  notifications: any[] = [];

  profileItems: any = [
    { title: "Perfil", icon: "mdi-account" },
    {
      title: "Configuración",
      icon: "mdi-cog-outline",
    },
    {
      title: "Cerrar Sesión",
      icon: "mdi-exit-to-app",
      action: this.logout,
    },
  ];

  user: any = {
    empleadoId: this.$auth.user.empleadoId,
    roles: [],
    nombreUsuario: `${this.$auth.user.empleado.apellidoPaterno} ${this.$auth.user.empleado.apellidoMaterno} ${this.$auth.user.empleado.nombres}`,
    correo: this.$auth.user.correo,
    foto: this.$auth.user.foto,
  };

  get title(): string {
    return hiscomStore.title;
  }

  maximize() {
    if (this.isResponsive) {
      this.drawer = !this.drawer;
    } else {
      this.miniVariant = !this.miniVariant;
      this.expandHover = !this.expandHover;
    }
  }

  logout() {
    this.$auth.logout();
    if (this.$route.name === "index") {
      location.reload();
    }
  }

  // Global snackbar handler.
  isSnackbar: boolean = false;
  // Snackbar payload default values.
  sPayload: SnackbarMutation = {
    message: "¡Información útil!",
    color: "primary",
    timeout: 3000,
    align: Align.Bottom,
  };

  // Global alert handler.
  isAlert: boolean = false;
  // Alert payload default values.
  aPayload: AlertMutation = {
    message: "¡Información útil!",
    type: AlertType.Success,
  };

  alertTimeout: any;

  get alertProxy() {
    return commonStore.alert;
  }

  get snackbarProxy() {
    return commonStore.snackbar;
  }

  @Watch("snackbarProxy")
  onSnackbarCalled() {
    this.sPayload = commonStore.snackbarPayload;
    this.isSnackbar = true;
  }

  @Watch("alertProxy")
  onAlertCalled() {
    if (this.isAlert) clearTimeout(this.alertTimeout);
    this.aPayload = commonStore.alertPayload;
    this.alertTimeout = setTimeout(() => {
      this.isAlert = false;
    }, 5000);
    this.isAlert = true;
  }

  async getNav() {
    const { data } = await this.$axios.get("/api/common/navigation");
    this.navItems = [
      {
        nombre: "Dashboard",
        icono: "mdi-apps",
        ruta: "/",
        nivel: 0,
      },
      ...data,
    ];
  }

  mounted() {
    hiscomStore.mutateGetNav(this.getNav);
    this.$store.state.hiscomModule.getNav();

    this.$axios.buildResponse({
      notify: false,
      request: "/api/common/notification",
      ifOk: ({ payload }) => {
        this.notifications = payload;
      },
    });
  }
}
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Encode+Sans:wght@300;400;500&display=swap");

.v-main__wrap {
  background-color: #eee !important;
}
.v-navigation-drawer {
  z-index: 666 !important;
}
.v-app-bar {
  z-index: 600 !important;
}
.app-alert {
  position: fixed !important;
  z-index: 420;
  top: 82px;
  right: -16px;
  min-width: 300px;
  max-width: 500px;
}
.r__app-alert {
  top: 74px;
  right: 8px !important;
  min-width: 200px !important;
  max-width: 300px !important;
}
.no-scrollbar .v-navigation-drawer__content {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}
.no-scrollbar .v-navigation-drawer__content::-webkit-scrollbar {
  display: none !important;
}
.user-name {
  font-family: "Encode Sans", sans-serif;
  margin-right: 16px;
}

.header-user__container {
  height: 54px;
  cursor: pointer;
  border: 1px solid grey;
  border-radius: 6px;
}
.header-user__container:hover {
  background-color: rgba(19, 81, 95, 0.25);
}
.header-user {
  display: inline-block !important;
  max-width: 400px;
  line-height: 18px;
  padding-top: 3px;
}
.header-user > span {
  font-size: 14px;
}

.v-stepper__content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
