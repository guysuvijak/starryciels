import { generateSigner, publicKey } from '@metaplex-foundation/umi';
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';
import { fetchCollection, updateCollection } from '@metaplex-foundation/mpl-core';

import { umi } from '@/utils/umi';

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111');
const collectionName = 'StarryCiels Planet';
const collectionAddress = publicKey('11111111111111111111111111111111');

const collectionUri = [
    {
        "attributes":[],
        "collection":{
            "family":"",
            "name":"Blockrons"
        },
        "description":"Blockrons is an experimental pixel art collection that has all of its art assets stored directly on the solana blockchain.",
        "image":"https://arweave.net/GZ4SrXwjnIWROjODkkAUN9yz-NECVovzwy6-E-GZXbQ?ext=png",
        "name":"Blockrons",
        "properties":{
            "category":"image",
            "creators":[
                {
                    "address":"F1QyW2RiabaUTHYYMZs6kVQmjw3QzhRWtAJNUp6ifWAe",
                    "share":100,
                    "verified":true
                }
            ],
            "files":[
                {
                    "type":"image/png",
                    "uri":"https://arweave.net/GZ4SrXwjnIWROjODkkAUN9yz-NECVovzwy6-E-GZXbQ?ext=png"
                }
            ]
        },
        "seller_fee_basis_points":0,
        "symbol":""
    }
];

export const CreateCollection = async () => {
    const response = await createCollection(umi, {
        collection: collectionSigner,
        name: collectionName,
        uri: 'https://example.com/my-nft.json',
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
    }).sendAndConfirm(umi);
    return response;
};

export const FetchCollection = async () => {
    const response = await fetchCollection(umi, collectionAddress);
    return response;
};

export const UpdateCollection = async () => {
    const response = await updateCollection(umi, {
        collection: collectionAddress,
        name: collectionName,
        uri: 'https://exmaple.com/new-uri',
    }).sendAndConfirm(umi);
    return response;
};