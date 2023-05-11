"use client";

import {
  UseQueryArgs,
  createRequest,
  useQuery as orig_useQuery,
} from "urql";
import { useUrqlValue } from "./useUrqlValue";

export const useQuery = wrap(orig_useQuery, [
  "data",
  "error",
]);

function wrap(
  useFn: typeof orig_useQuery,
  transportKeys: string[]
): typeof orig_useQuery {
  return ((queryArgs: UseQueryArgs) => {
    const request = createRequest(queryArgs.query, queryArgs.variables || {});
    useUrqlValue(request.key)
  
    const [result, execute] = useFn(queryArgs);
  
    const transported: any = {};
    for (const key of transportKeys) {
      // @ts-ignore
      transported[key] = result[key];
    }
  
    console.log(request.key, transported)
    useUrqlValue(request.key, transported)

    return [result, execute];
  }) as typeof orig_useQuery;
}