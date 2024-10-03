import { publicKey, generateSigner } from '@metaplex-foundation/umi';
import { fetchCollection, create, fetchAssetsByOwner, update, fetchAsset } from '@metaplex-foundation/mpl-core';
import { umi, DelegateSigner } from '@/utils/umi';

const addressProfileCollection = publicKey(process.env.ADDRESS_COLLECTION_PROFILE as string);
const addressUpdated = publicKey(process.env.ADDRESS_SIGNER as string);
const masterSigner = publicKey(DelegateSigner);

export const CreateProfile = async (owner: string, nickname: string) => {
    const assetSigner = generateSigner(umi);

    const collection = await fetchCollection(umi, addressProfileCollection);
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
        'image': 'https://gateway.pinata.cloud/ipfs/QmauoA8uruGH4xkde8uLMDQCuzi4QLQ8q4pYmJj1MFZL6N',
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
                authority: { type: 'Address', address: masterSigner },
                frozen: true
            },
            {
                type: 'TransferDelegate',
                authority: { type: 'Address', address: masterSigner },
            },
            {
                type: 'UpdateDelegate',
                authority: { type: 'Address', address: masterSigner },
                additionalDelegates: [
                    addressUpdated
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
    }).sendAndConfirm(umi);
    return { response, assetAddress: assetSigner.publicKey };
};

export const CheckProfile = async (owner: string) => {
    const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
        skipDerivePlugins: false,
    })
    const collectionAssets = assetsByOwner.filter((asset: any) => 
        asset.updateAuthority.type === 'Collection' && asset.updateAuthority.address.toString() === addressProfileCollection.toString()
    );
    return collectionAssets;
};

export const UpdateProfile = async (owner: string, assetId: any) => {
    const asset = await fetchAsset(umi, assetId);
    const base64Data = asset.uri.split(',')[1];
    const jsonString = atob(base64Data);
    const metadata = JSON.parse(jsonString);
    const updatedJsonString = JSON.stringify(metadata);
    const updatedBase64 = btoa(updatedJsonString);
    const newUri = `data:application/json;base64,${updatedBase64}`;
    
    const response = await update(umi, {
        asset: asset,
        collection: { publicKey: addressProfileCollection },
        uri: newUri
    }).sendAndConfirm(umi);
    return response;
};