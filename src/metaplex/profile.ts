import { publicKey, generateSigner } from '@metaplex-foundation/umi';
import { fetchCollection, create, fetchAssetsByOwner, updatePlugin, fetchAsset, thawAsset } from '@metaplex-foundation/mpl-core';
import { umi, addressCollectionProfile, addressSigner, DelegateSigner } from '@/utils/umi';

export const CreateProfile = async (owner: string, nickname: string) => {
    const profilePinata = process.env.PROFILE_PINATA as string;
    const assetSigner = generateSigner(umi);

    const collection = await fetchCollection(umi, addressCollectionProfile);
    const currentDate = new Date().toISOString();

    const metadataName = `StarryCiels Profile #${collection.numMinted}`;
    const attributes = [
        { trait_type: 'birthday', value: currentDate },
        { trait_type: 'nickname', value: nickname }
    ];

    const metadata = {
        'name': metadataName,
        'symbol': 'STCTPF',
        'description': 'StarryCiels Player Profile',
        'image': profilePinata,
        'external_url': 'https://starryciels.vercel.app',
        'attributes': attributes
    };
    const metadataString = JSON.stringify(metadata);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;

    const response = await create(umi, {
        name: metadataName,
        uri: base64Uri,
        asset: assetSigner,
        owner: publicKey(owner),
        collection: collection,
        plugins: [
            {
                type: 'FreezeDelegate',
                authority: { type: 'Address', address: addressSigner },
                frozen: true
            },
            {
                type: 'TransferDelegate',
                authority: { type: 'Address', address: addressSigner },
            },
            {
                type: 'UpdateDelegate',
                authority: { type: 'Address', address: addressSigner },
                additionalDelegates: [
                    addressSigner
                ]
            },
            {
                type: 'Attributes',
                attributeList: [
                    { key: 'birthday', value: currentDate },
                    { key: 'nickname', value: nickname },
                    { key: 'ore', value: '0' },
                    { key: 'fuel', value: '0' },
                    { key: 'food', value: '0' }
                ]
            }
        ],
    }).sendAndConfirm(umi, {confirm: { commitment: 'finalized' }});
    return { response, assetAddress: assetSigner.publicKey };
};

export const CheckProfile = async (owner: string, maxRetries = 10) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
                skipDerivePlugins: false,
            });
            const collectionAssets = assetsByOwner.filter((asset: any) =>
                asset.updateAuthority.type === 'Collection' && asset.updateAuthority.address.toString() === addressCollectionProfile.toString()
            );
            return collectionAssets;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

export const UpdateProfile = async (owner: string, assetId: string, type: string, resource: string) => {
    const profileData = await CheckProfile(owner);
    if (profileData && profileData[0]?.attributes?.attributeList) {
        const attributeList = profileData[0].attributes.attributeList;
        const birthday = String(attributeList.find(attr => attr.key === 'birthday')?.value) || '';
        const nickname = String(attributeList.find(attr => attr.key === 'nickname')?.value) || '';
        const ore = Number(attributeList.find(attr => attr.key === 'ore')?.value) || 0;
        const fuel = Number(attributeList.find(attr => attr.key === 'fuel')?.value) || 0;
        const food = Number(attributeList.find(attr => attr.key === 'food')?.value) || 0;

        const response = await updatePlugin(umi, {
            asset: publicKey(assetId),
            collection: addressCollectionProfile,
            plugin: {
                type: 'Attributes',
                attributeList: [
                    { key: 'birthday', value: birthday },
                    { key: 'nickname', value: nickname },
                    { key: 'ore', value: String(ore + Number(type === 'Ore' ? Number(resource) : 0)) },
                    { key: 'fuel', value: String(fuel + Number(type === 'Fuel' ? Number(resource) : 0)) },
                    { key: 'food', value: String(food + Number(type === 'Food' ? Number(resource) : 0)) },
                ]
            }
        }).sendAndConfirm(umi);
        return response;
    }
};

export const ThawProfile = async (owner: string, assetId: string) => {
    const assetAccount = await fetchAsset(umi, assetId)
    const collection = await fetchCollection(umi, addressCollectionProfile);
    const response = await thawAsset(umi, {
        asset: assetAccount,
        collection: collection,
        delegate: DelegateSigner

    }).sendAndConfirm(umi);
    return response;
};