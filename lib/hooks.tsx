"use client";
import {
    createRequest,
  useQuery as orig_useQuery,
} from "urql";
import { useTransportValue } from "./useTransportValue";

export const useQuery = wrap(orig_useQuery, [
  "data",
  "error",
]);

function wrap(
  useFn: any,
  transportKeys: any[]
): any {
  return ((...args: any[]) => {
    const request = createRequest(args[0].query, args[0].variables || {});
    useTransportValue(request.key)
    const [result, execute] = useFn(...args);
    const transported: any = {};
    for (const key of transportKeys) {
      transported[key] = result[key];
    }
    useTransportValue(request.key, transported)
    return [result, execute];
  }) as any;
}