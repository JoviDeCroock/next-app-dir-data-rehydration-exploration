"use client";

import Link from "next/link";
import { Suspense } from "react";
import { gql, useQuery } from "urql";

export default function Page() {
    return (
        <Suspense>
            <Pokemons />
        </Suspense>
    )
}

const PokemonsQuery = gql`
  query {
    pokemons(limit: 10) { id name }
  }
`;

function Pokemons() {
    const [result] = useQuery({ query: PokemonsQuery });
    return (
        <main>
        <h1>This is rendered as part of SSR</h1>
        <ul>
          {result.data.pokemons.map(x => <li key={x.id}>{x.name}</li>)}
        </ul>
        <Link href="/">
          RSC
        </Link>
      </main>
    )
}
