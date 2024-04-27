import { Module, VuexModule, VuexMutation } from "nuxt-property-decorator";

@Module({
  name: "hiscomModule",
  stateFactory: true,
  namespaced: true,
})
export default class HiscomModule extends VuexModule {
  title: string = "Hiscom";
  getNav: () => Promise<void> = async () => {};

  @VuexMutation
  mutateTitle(title: string) {
    this.title = title;
  }

  @VuexMutation
  mutateGetNav(value: () => Promise<void>) {
    this.getNav = value;
  }
}
