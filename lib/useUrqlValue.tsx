"use client";

import { useDataHydrationContext } from "./DataHydrationContext";
import { ssr } from "./urql-ssr";

export const symbolString = "urql_transport"
export const urqlTransportSymbol = Symbol.for(symbolString)

export function useUrqlValue(operationKey: number, value?: { data: any, error: any }): void {
  const rehydrationContext = useDataHydrationContext();

  if (typeof window == "undefined") {
    if (rehydrationContext && value) {
      rehydrationContext.operationValuesByKey[operationKey] = value;
    }
  } else {
    const urqlTransport = window[urqlTransportSymbol as any];
    const store = (urqlTransport && urqlTransport[0] as unknown as { rehydrate: Record<string, { data: any, error: any }> })
    if (store) {
      const result = store.rehydrate && store.rehydrate[operationKey];
      if (result) {
        ssr.restoreData({
            [operationKey]: { data: JSON.stringify(result.data), error: result.error }
        })
        delete store.rehydrate[operationKey];
      }
    }
  }
}