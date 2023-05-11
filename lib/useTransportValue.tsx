"use client";

import { useEffect, useState } from "react";
import { useRehydrationContext } from "./RehydrationContext";
import { ssr } from "./urql-ssr";

export const urqlTransportSymbol = Symbol.for("urql_transport")

export function useTransportValue<T>(key: number, value?: T): void {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const rehydrationContext = useRehydrationContext();
  if (typeof window == "undefined") {
    if (rehydrationContext && value) {
      rehydrationContext.transportValueData[key] = value;
    }
  } else {
    const urqlTransport = window[urqlTransportSymbol];
    const store = urqlTransport && urqlTransport[0]
    if (store) {
        const result = store.rehydrate && store.rehydrate[key];
      if (isClient) {
        delete store.rehydrate[key];
      }
      if (result) {
        ssr.restoreData({
            [key]: { data: JSON.stringify(result.data) }
        })
        delete store.rehydrate[key];
      }
    }
  }
}