import { Vue, Component } from "nuxt-property-decorator";
import { hiscomStore } from "~/store";

@Component
class RuleMixin extends Vue {
  $metaInfo: any;
  mounted() {
    if (this.$metaInfo) {
      hiscomStore.mutateTitle(this.$metaInfo.title);
    }
  }
}

Vue.mixin(RuleMixin);
