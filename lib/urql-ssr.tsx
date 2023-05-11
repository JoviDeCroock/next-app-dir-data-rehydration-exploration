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
    // When we enter the client we want to restore
    // the ssr-exchange with the contents
    // of this else branch.
  } else {
    // when we are on the server and we flush
    // and/or are done rendering we need to call
    // insertHtml with a script tag containing
    // the output of ssr.extractData()
  }

  return (
    <Provider
      value={client}
    >
      {children}
    </Provider>
  );
}
