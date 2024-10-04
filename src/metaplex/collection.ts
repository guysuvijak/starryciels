import { generateSigner, publicKey } from '@metaplex-foundation/umi';
import { createCollection, fetchCollection, ruleSet } from '@metaplex-foundation/mpl-core';
import { umi, txConfig } from '@/utils/umi';

const creator1 = publicKey(process.env.ADDRESS_CREATOR as string);
const collectionName = 'StarryCiels Planet';
const collectionAddress = publicKey(process.env.ADDRESS_COLLECTION_PLANET as string);
const signerPublicKey = publicKey(process.env.ADDRESS_SIGNER as string);

export const CreatePlanetCollection = async () => {
    const signer = generateSigner(umi);
    console.log('signer', signer);

    const collectionUri = {
        'attributes': [],
        'collection': {
            'family': '',
            'name': collectionName
        },
        'description': 'StarryCiels Planet Collection',
        'image': 'https://gateway.pinata.cloud/ipfs/QmNUxxRAa8ZdHNszc2JDnTTqgDFjDX9eAvfm9FeBJ7svKY',
        'name': collectionName,
        'symbol': 'STCTPN',
        'external_url': 'https://starryciels.vercel.app',
        'properties': {
            'category': 'image',
            'creators': [
                {
                    'address': creator1,
                    'share': 100,
                    'verified': true
                }
            ],
            'files': [
                {
                    'type':'image/png',
                    'uri': 'https://gateway.pinata.cloud/ipfs/QmNUxxRAa8ZdHNszc2JDnTTqgDFjDX9eAvfm9FeBJ7svKY',
                }
            ]
        },
        'seller_fee_basis_points': 500
    };
    const metadataString = JSON.stringify(collectionUri);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;

    const response = await createCollection(umi, {
        collection: signer,
        updateAuthority: signerPublicKey,
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

    const metadata = {
        'name': 'StarryCiels Player Profile',
        'symbol': 'STCTPF',
        'description': 'StarryCiels Player Profile Collection',
        'image': 'https://gateway.pinata.cloud/ipfs/QmauoA8uruGH4xkde8uLMDQCuzi4QLQ8q4pYmJj1MFZL6N',
        'external_url': 'https://starryciels.vercel.app',
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