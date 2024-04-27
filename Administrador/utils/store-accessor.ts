import { Store } from "vuex";
import { getModule } from "nuxt-property-decorator";
import CommonModule from "~/store/commonModule";
import HiscomModule from "~/store/hiscomModule";

// eslint-disable-next-line import/no-mutable-exports
let commonStore: CommonModule;
// eslint-disable-next-line import/no-mutable-exports
let hiscomStore: HiscomModule;

function initializeStores(store: Store<any>): void {
  commonStore = getModule(CommonModule, store);
  hiscomStore = getModule(HiscomModule, store);
}

export { initializeStores, commonStore, hiscomStore };
