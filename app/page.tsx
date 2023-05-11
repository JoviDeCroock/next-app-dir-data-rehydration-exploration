import Link from 'next/link';
import { gql } from '@urql/core';

import { getCachedClient } from './Data'

const PokemonsQuery = gql`
  query {
    pokemons(limit: 10) { id name }
  }
`;

export default async function Home() {
  const result = await getCachedClient().query(PokemonsQuery, {})
  return (
    <main>
      <h1>This is rendered as part of an RSC</h1>
      <ul>
        {result.data.pokemons.map(x => <li key={x.id}>{x.name}</li>)}
      </ul>
      <Link href="/non-rsc">
        Non RSC
      </Link>
    </main>
  )
}
