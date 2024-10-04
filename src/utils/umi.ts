import { TransactionBuilderSendAndConfirmOptions, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { clusterApiUrl } from '@solana/web3.js';

//const rpcUrl = process.env.RPC_URL as string;
//export const umi = createUmi(rpcUrl).use(mplCore());
export const umi = createUmi(clusterApiUrl('devnet')).use(mplCore());

const base64Secret = process.env.SECRET_KEY_BASE64 as string;
const secret = new Uint8Array(Buffer.from(base64Secret, 'base64'));
const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
const collectionSigner = createSignerFromKeypair(umi, myKeypair);
umi.use(signerIdentity(collectionSigner));

export const DelegateSigner = collectionSigner;

export const txConfig: TransactionBuilderSendAndConfirmOptions = {
    send: { skipPreflight: true },
    confirm: { commitment: 'processed' }
};

export const addressCreator = publicKey(process.env.ADDRESS_CREATOR as string);
export const addressCollectionPlanet = publicKey(process.env.ADDRESS_COLLECTION_PLANET as string);
export const addressCollectionProfile = publicKey(process.env.ADDRESS_COLLECTION_PROFILE as string);
export const addressSigner = publicKey(process.env.ADDRESS_SIGNER as string);