import React from 'react';
import {cacheExchange, createClient, fetchExchange} from '@urql/core';

const makeClient = () => {
    return createClient({
        url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
        exchanges: [cacheExchange, fetchExchange]
    })
}

export const getCachedClient = React.cache(makeClient)
