"use client";

import React from "react";
import {
  createClient,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  Provider,
  debugExchange
} from "urql";
import { DataHydrationContextProvider } from "./DataHydrationContext";

export const ssr = ssrExchange();
const client = createClient({
  url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  exchanges: [cacheExchange, debugExchange, ssr, fetchExchange],
  suspense: true
});

export function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <Provider
      value={client}
    >
      <DataHydrationContextProvider>
        {children}
      </DataHydrationContextProvider>
    </Provider>
  );
}
