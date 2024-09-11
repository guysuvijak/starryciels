import { TransactionBuilderSendAndConfirmOptions, publicKey, generateSigner } from '@metaplex-foundation/umi';
import { fetchAssetsByCollection, fetchCollection, create, fetchAsset, ruleSet, transfer } from '@metaplex-foundation/mpl-core';
import { sendAndConfirmTx } from '@lightprotocol/stateless.js';
import { umi } from '@/utils/umi';

const creator1 = publicKey('HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH');
const collectionAddress = publicKey('Abku8gXwJqxhV2tDnffUnkUGjqdbsi3WWEQhZf2LTwuQ');

export const CreateAsset = async () => {
    const assetSigner = generateSigner(umi);

    const txConfig: TransactionBuilderSendAndConfirmOptions = {
        send: { skipPreflight: true },
        confirm: { commitment: 'processed' },
    };

    const collecion = await fetchCollection(umi, collectionAddress);

    const metadata = {
        "name": "StarryCiels Planet",
        "symbol": "STCTP",
        "description": "StarryCiels Planet on Solana blockchain.",
        "image": "https://starryciels.vercel.app/assets/images/coal-import.png",
        "external_url": "https://starryciels.vercel.app",
        "attributes": [
            {
                "trait_type": "color",
                "value": "1"
            },
            {
                "trait_type": "size",
                "value": "3"
            },
            {
                "trait_type": "durability",
                "value": "47"
            },
            {
                "trait_type": "components",
                "value": "iron: 10; carbon: 1; wood: 2"
            }
        ]
    };
    const metadataString = JSON.stringify(metadata);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;
    console.log('Base64 URI:', base64Uri);

    const response = await create(umi, {
        name: 'StarryCiels Planet #1',
        uri: base64Uri,
        asset: assetSigner,
        collection: collecion,
        plugins: [
            {
                type: 'Royalties',
                basisPoints: 500,
                creators: [
                    {
                        address: creator1,
                        percentage: 100,
                    }
                ],
                ruleSet: ruleSet('None')
            },
        ]
    }).sendAndConfirm(umi, txConfig);
    return { response, assetAddress: assetSigner.publicKey };
};

export const FetchAsset = async () => {
    const asset = await fetchAsset(umi, '3KSYv6FkHVzfmxLAfJi35PZNoHajix4RA6Tbze66YjTW', {
        skipDerivePlugins: false,
    });
    return asset;
};

export const TransferAsset = async () => {
    const txConfig: TransactionBuilderSendAndConfirmOptions = {
        send: { skipPreflight: true },
        confirm: { commitment: 'processed' },
    };

    const result = await transfer(umi, {
        asset: 'GgK2ipro24HmDom5mWThqdFCqZ9DzrCbjetQ3bsw2CG6' as any,
        newOwner: creator1,
        collection: collectionAddress as any
    }).sendAndConfirm(umi, txConfig)
    return result;
};

export const FetchAssetByCollection = async () => {
    const assetsByCollection = await fetchAssetsByCollection(umi, collectionAddress, {
        skipDerivePlugins: false,
    });
    return assetsByCollection;
};