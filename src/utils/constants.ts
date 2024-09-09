import { Client, fetchExchange } from '@urql/core';
import createEdgeClient from '@honeycomb-protocol/edge-client';

const API_URL = 'https://edge.test.honeycombprotocol.com/';

const urqlClient = new Client({
    url: API_URL,
    exchanges: [fetchExchange],
});

export const client = createEdgeClient(String(urqlClient), true);