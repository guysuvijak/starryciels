import { TransactionBuilderSendAndConfirmOptions, generateSigner, publicKey, sol, keypairIdentity, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { createCollection, fetchCollection, updateCollection, ruleSet } from '@metaplex-foundation/mpl-core';

import { umi } from '@/utils/umi';

const secret = new Uint8Array([16,151,34,252,65,187,220,138,128,20,165,199,238,236,209,57,53,216,182,163,172,121,252,108,93,254,189,205,158,110,212,181,215,25,187,26,229,167,110,10,19,111,134,18,169,32,209,221,24,193,47,208,204,33,202,197,73,51,151,10,204,181,23,136]);
const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
const collectionSigner = createSignerFromKeypair(umi, myKeypair);
umi.use(signerIdentity(collectionSigner));

const creator1 = publicKey('HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH');
const collectionName = 'StarryCiels Planet Test1';
const collectionAddress = publicKey('Abku8gXwJqxhV2tDnffUnkUGjqdbsi3WWEQhZf2LTwuQ');

export const CreateCollection = async () => {
    console.log('process...')
    const signer = generateSigner(umi);
    console.log('signer', signer)

    const txConfig: TransactionBuilderSendAndConfirmOptions = {
        send: { skipPreflight: true },
        confirm: { commitment: 'processed' },
    };

    const collectionUri = [
        {
            "attributes": [],
            "collection": {
                "family": "",
                "name": collectionName
            },
            "description": "StarryCiels is an experimental pixel art collection that has all of its art assets stored directly on the solana blockchain.",
            "image": `https://starryciels.vercel.app/metadata/icon-512x512.png`,
            "name": collectionName,
            "properties": {
                "category": "image",
                "creators": [
                    {
                        "address": creator1,
                        "share": 100,
                        "verified": true
                    }
                ],
                "files": [
                    {
                        "type":"image/png",
                        "uri": `https://starryciels.vercel.app/metadata/icon-512x512.png`,
                    }
                ]
            },
            "seller_fee_basis_points": 500,
            "symbol": ""
        }
    ];

    const response = await createCollection(umi, {
        collection: signer,
        updateAuthority: collectionSigner.publicKey,
        name: collectionName,
        uri: `https://starryciels.vercel.app/metadata`,
        plugins: [
            {
                type: 'Royalties',
                basisPoints: 500,
                creators: [
                    {
                    address: creator1,
                    percentage: 100
                    }
                ],
                ruleSet: ruleSet('None')
            },
        ],
    }).sendAndConfirm(umi, txConfig);
    return { response, collectionAddress: signer.publicKey };
};

export const FetchCollection = async () => {
    const response = await fetchCollection(umi, collectionAddress);
    return response;
};

//export const UpdateCollection = async () => {
//    const response = await updateCollection(umi, {
//        collection: collectionAddress,
//        name: collectionName,
//        uri: `data:application/json;base64,${Buffer.from(JSON.stringify(collectionUri[0])).toString('base64')}`,
//    }).sendAndConfirm(umi);
//    return response;
//};