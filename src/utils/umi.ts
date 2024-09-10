import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';

const rpcUrl = process.env.RPC_URL as string;

export const umi = createUmi(rpcUrl).use(mplCore());