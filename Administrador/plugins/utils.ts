import Vue from "vue";
import { EgAxiosInstance } from "~/utils/response";

declare module "vue/types/vue" {
  interface Vue {
    $getRandomElement<T>(input: Array<T> | undefined): T;
    $isNotEmpty(input: Array<any> | undefined): boolean;
    $isNotSingle(input: Array<any> | undefined): boolean;
    $isString(input: string | undefined | null): boolean;
    $axios: EgAxiosInstance;
  }
}

Vue.prototype.$getRandomElement = function <T>(
  input: Array<T> | undefined,
): T | null {
  if (Array.isArray(input) && input.length > 0) {
    const randomIndex: number = Math.floor(Math.random() * input.length);
    // eslint-disable-next-line no-console
    // console.warn(`Random element: ${input[randomIndex]}, at ${randomIndex}`)
    return input[randomIndex];
  } else return null;
};

Vue.prototype.$isNotEmpty = (input: Array<any> | undefined): boolean =>
  Array.isArray(input) && input.length > 0;

Vue.prototype.$isNotSingle = (input: Array<any> | undefined): boolean =>
  Array.isArray(input) && input.length > 1;

Vue.prototype.$isString = (input: string | undefined | null): boolean =>
  typeof input === "string" && input.trim().length > 0;
