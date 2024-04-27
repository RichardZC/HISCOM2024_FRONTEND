import { buildResponse } from "~/utils/response/build-response";
import { buildResponses } from "~/utils/response/build-responses";
import { getResponse } from "~/utils/response/get-response";

export default function ({ $axios }: any) {
  $axios.getResponse = getResponse;
  $axios.buildResponse = buildResponse;
  ($axios.buildResponses as any) = buildResponses;
}
