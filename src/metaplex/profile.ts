import { TransactionBuilderSendAndConfirmOptions, publicKey, generateSigner } from '@metaplex-foundation/umi';
import { fetchCollection, create, fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import { umi } from '@/utils/umi';

export const CreateProfile = async (owner: any, nickname: string) => {
    const assetSigner = generateSigner(umi);

    const txConfig: TransactionBuilderSendAndConfirmOptions = {
        send: { skipPreflight: true },
        confirm: { commitment: 'processed' },
    };

    const collection = await fetchCollection(umi, '7N1e73MEwJ1saYauQWWNZ81n3xuzXr126KrPiHGAQjad');
    const currentDate = new Date().toISOString();

    const metadata = {
        "name": "Player Profile",
        "symbol": "STCTPF",
        "description": "StarryCiels Player Profile",
        "image": "https://starryciels.vercel.app/assets/metaplex/profile.png",
        "external_url": "https://starryciels.vercel.app",
        "attributes": [
            {
                "trait_type": "birthday",
                "value": currentDate
            },
            {
                "trait_type": "nickname",
                "value": nickname
            }
        ]
    };
    const metadataString = JSON.stringify(metadata);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;

    const response = await create(umi, {
        name: 'Player Profile',
        uri: base64Uri,
        asset: assetSigner,
        owner: publicKey(owner),
        collection: collection
    }).sendAndConfirm(umi, txConfig);
    return { response, assetAddress: assetSigner.publicKey };
};

export const CheckProfile = async (owner: any) => {
    const collection = publicKey('7N1e73MEwJ1saYauQWWNZ81n3xuzXr126KrPiHGAQjad');
    const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
        skipDerivePlugins: false,
    })
    const collectionAssets = assetsByOwner.filter((asset: any) => 
        asset.updateAuthority.type === 'Collection' && asset.updateAuthority.address.toString() === collection.toString()
    );
    return collectionAssets;
};