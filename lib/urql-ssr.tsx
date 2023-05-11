"use client";
import React from "react";
import {
  createClient,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  Provider
} from "urql";
import { ServerInsertedHTMLContext } from "next/navigation";

const ssr = ssrExchange();
const client = createClient({
  url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  exchanges: [cacheExchange, ssr, fetchExchange],
  suspense: true
});

export function Wrapper({ children }: React.PropsWithChildren) {
  const insertHtml = React.useContext(ServerInsertedHTMLContext);

  if (typeof window !== 'undefined') {
    // restore ssr exchange
  }

  return (
    <Provider
      value={client}
    >
      {children}
    </Provider>
  );
}
