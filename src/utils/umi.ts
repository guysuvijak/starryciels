import { TransactionBuilderSendAndConfirmOptions } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { clusterApiUrl } from '@solana/web3.js';

const rpcUrl = process.env.RPC_URL as string;

export const umi = createUmi(clusterApiUrl('devnet')).use(mplCore());

export const txConfig: TransactionBuilderSendAndConfirmOptions = {
    send: { skipPreflight: true },
    confirm: { commitment: 'processed' },
};