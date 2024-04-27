import { Vue, Component, Prop } from "nuxt-property-decorator";
import { ErrorPayload } from "~/types/common";

@Component({
  auth: false,

  // Head configuration.
  head(this: ErrorPage) {
    return { title: `Error ${this.error.statusCode}` };
  },
})
export default class ErrorPage extends Vue {
  // Metadata about the error.
  @Prop({
    default: {
      statusCode: 420,
      message: "Fatal server error.",
    },
  })
  error!: ErrorPayload;

  backgrounds: Array<string> = [
    "https://media.giphy.com/media/1lALzcU4pUHWWMGTlK/giphy.gif",
    "https://media.giphy.com/media/3NeSk2IVEd2FYUQEcM/giphy.gif",
    "https://media.giphy.com/media/xThuWuex66yqi0d6Fy/giphy.gif",
    "https://media.giphy.com/media/l2SpSPD5I0NfXI4SI/giphy.gif",
    "https://media.giphy.com/media/t7CyBKFjrss3C/giphy.gif",
    "https://media.giphy.com/media/riw3K0D2h4klG/giphy.gif",
    "https://media.giphy.com/media/nIlgTxY29wJuU/giphy.gif",
  ];
}
