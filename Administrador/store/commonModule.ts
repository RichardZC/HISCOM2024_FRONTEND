import { Module, VuexModule, VuexMutation } from "nuxt-property-decorator";
import { AlertMutation, AlertType, Align, SnackbarMutation } from "~/types";

@Module({
  name: "commonModule",
  stateFactory: true,
  namespaced: true,
})
export default class CommonModule extends VuexModule {
  isTitleLoading: boolean = false;

  @VuexMutation
  mutateLoading(isLoading: boolean) {
    this.isTitleLoading = isLoading;
  }

  snackbar: number = 0;
  snackbarPayload: SnackbarMutation = {
    message: "¡Información útil!",
    color: "primary",
  };

  alert: number = 0;
  alertPayload: AlertMutation = {
    message: "¡Información útil!",
    type: AlertType.Success,
  };

  @VuexMutation
  showAlert(payload: AlertMutation) {
    this.alertPayload = payload;
    this.alert++;
  }

  @VuexMutation
  showSnackbar(payload: SnackbarMutation) {
    this.snackbarPayload = {
      message: payload.message,
      color: payload.color ?? "primary",
      timeout: payload.timeout ?? 3000,
      align: payload.align ?? Align.Bottom,
    };
    this.snackbar++;
  }
}
