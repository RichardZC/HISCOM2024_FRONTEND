import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "app",

  // Head configuration.
  head() {
    return { title: "Dashboard" };
  },
})
export default class IndexPage extends Vue {}
