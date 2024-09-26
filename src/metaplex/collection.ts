import { TransactionBuilderSendAndConfirmOptions, generateSigner, publicKey, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { createCollection, fetchCollection, ruleSet } from '@metaplex-foundation/mpl-core';
import { umi } from '@/utils/umi';

const secret = new Uint8Array([16,151,34,252,65,187,220,138,128,20,165,199,238,236,209,57,53,216,182,163,172,121,252,108,93,254,189,205,158,110,212,181,215,25,187,26,229,167,110,10,19,111,134,18,169,32,209,221,24,193,47,208,204,33,202,197,73,51,151,10,204,181,23,136]);
const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
const collectionSigner = createSignerFromKeypair(umi, myKeypair);
umi.use(signerIdentity(collectionSigner));

const creator1 = publicKey('HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH');
const collectionName = 'StarryCiels Planet';
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
            "image": `https://starryciels.vercel.app/assets/planet-collection.png`,
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
                        "uri": `https://starryciels.vercel.app/assets/planet-collection.png`,
                    }
                ]
            },
            "seller_fee_basis_points": 500,
            "symbol": ""
        }
    ];
    const metadataString = JSON.stringify(collectionUri);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;

    const response = await createCollection(umi, {
        collection: signer,
        updateAuthority: collectionSigner.publicKey,
        name: collectionName,
        uri: base64Uri,
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

export const CreateProfileCollection = async () => {
    const collectionSigner = generateSigner(umi);

    const txConfig: TransactionBuilderSendAndConfirmOptions = {
        send: { skipPreflight: true },
        confirm: { commitment: 'processed' },
    };

    const metadata = {
        "name": "StarryCiels Player Profile",
        "symbol": "STCTPF",
        "description": "StarryCiels Player Profile Collection",
        "image": "https://starryciels.vercel.app/assets/metaplex/profile.png",
        "external_url": "https://starryciels.vercel.app",
    };
    const metadataString = JSON.stringify(metadata);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;

    const response = await createCollection(umi, {
        collection: collectionSigner,
        name: 'StarryCiels Player Profile',
        uri: base64Uri,
    }).sendAndConfirm(umi, txConfig);
    return { response, collectionAddress: collectionSigner.publicKey };
}

export const FetchCollection = async () => {
    const response = await fetchCollection(umi, collectionAddress);
    return response;
};