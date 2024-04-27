<template lang="pug">
v-container.fill-height.pa-0(fluid)
  .error-background(
    :style="{ backgroundImage: `url(${$getRandomElement(backgrounds)})` }"
  )
  v-row(justify="center")
    v-col(cols="10", md="6", lg="4")
      v-card.text-center.pa-6(outlined)
        span.error-title Error {{ error.statusCode }}
        .error-subtitle {{ error.message }}
        div Volver al
          | &nbsp;
          nuxt-link(to="/") inicio
</template>

<style scoped>
.error-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: repeat;
  opacity: 0.125;
}
.error-title {
  font-size: 48px;
  line-height: normal;
}
.error-subtitle {
  font-size: 18px;
  line-height: normal;
  margin-bottom: 25px;
}
</style>

<script lang="ts">
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
</script>
