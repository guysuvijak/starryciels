import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { clusterApiUrl } from "@solana/web3.js";

const rpcUrl = process.env.RPC_URL as string;
console.log('clusterApiUrl("devnet")',clusterApiUrl("devnet"))

export const umi = createUmi(clusterApiUrl("devnet")).use(mplCore());