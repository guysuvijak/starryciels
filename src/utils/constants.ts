import createEdgeClient from '@honeycomb-protocol/edge-client';

const API_URL = process.env.HC_API_URL;

export const client = createEdgeClient(String(API_URL), true);