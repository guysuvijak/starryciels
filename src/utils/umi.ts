import { TransactionBuilderSendAndConfirmOptions, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { clusterApiUrl } from '@solana/web3.js';

const rpcUrl = process.env.RPC_URL as string;

export const umi = createUmi(clusterApiUrl('devnet')).use(mplCore());

const secret = new Uint8Array([16,151,34,252,65,187,220,138,128,20,165,199,238,236,209,57,53,216,182,163,172,121,252,108,93,254,189,205,158,110,212,181,215,25,187,26,229,167,110,10,19,111,134,18,169,32,209,221,24,193,47,208,204,33,202,197,73,51,151,10,204,181,23,136]);
const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
const collectionSigner = createSignerFromKeypair(umi, myKeypair);
umi.use(signerIdentity(collectionSigner));

export const txConfig: TransactionBuilderSendAndConfirmOptions = {
    send: { skipPreflight: true },
    confirm: { commitment: 'processed' },
};