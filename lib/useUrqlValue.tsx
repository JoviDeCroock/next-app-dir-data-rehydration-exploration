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
    const stores = (window[urqlTransportSymbol as any] || []) as unknown as Array<{ rehydrate: Record<number, { data: any, error: any }>}>;
    const store = stores.find(x => x && x.rehydrate && x.rehydrate[operationKey])
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