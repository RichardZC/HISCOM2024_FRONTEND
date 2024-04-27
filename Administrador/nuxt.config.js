import colors from "vuetify/es5/util/colors";
import ves from "vuetify/es5/locale/es";

const PRODUCTION_URL = "http://api.hrayacucho.gob.pe/back";
const DEVELOPMENT_URL = "http://localhost:51302";

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - HISCOM",
    title: "HISCOM",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/axios.ts",
    "~/plugins/utils.ts",
    "~/plugins/rules.ts",
    "~/plugins/head.ts",
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    "@nuxtjs/composition-api",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://auth.nuxtjs.org/
    "@nuxtjs/auth",
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL:
      process.env.NODE_ENV === "production" ? PRODUCTION_URL : DEVELOPMENT_URL,
    headers: { "Content-Type": "application/json" },
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL:
        process.env.NODE_ENV === "production"
          ? PRODUCTION_URL
          : DEVELOPMENT_URL,
      headers: { "Content-Type": "application/json" },
    },
    captchaKey: "6LedzX0cAAAAAH0fIhA1bRu_YbNlJM94tjr0FCeL",
  },

  auth: {
    strategies: {
      redirect: {
        login: "/login",
        logout: "/login",
        callback: false,
        home: "/",
      },
      cookie: false,
      local: {
        endpoints: {
          login: {
            url: "/api/public/login",
            method: "post",
            propertyName: false,
          },
          user: {
            url: "/api/common/get-user",
            method: "get",
            propertyName: false,
          },
          logout: false,
        },
      },
    },
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    lang: {
      locales: { es: ves },
      current: "es",
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#5f1351",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: "#337B2B",
        },
      },
    },
  },

  router: {
    middleware: ["auth", "permission"],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
  },
};
