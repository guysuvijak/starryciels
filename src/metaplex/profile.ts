import { publicKey, generateSigner, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import { fetchCollection, create, fetchAssetsByOwner, update, fetchAsset } from '@metaplex-foundation/mpl-core';
import { umi, txConfig } from '@/utils/umi';

const secret = new Uint8Array([16,151,34,252,65,187,220,138,128,20,165,199,238,236,209,57,53,216,182,163,172,121,252,108,93,254,189,205,158,110,212,181,215,25,187,26,229,167,110,10,19,111,134,18,169,32,209,221,24,193,47,208,204,33,202,197,73,51,151,10,204,181,23,136]);
const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
const collectionSigner = createSignerFromKeypair(umi, myKeypair);
umi.use(signerIdentity(collectionSigner));

const addressProfileCollection = publicKey('7N1e73MEwJ1saYauQWWNZ81n3xuzXr126KrPiHGAQjad');
const addressUpdated = publicKey('FUfQsR8QnCEUd1ZbzvCSCkNbnS1aCHKpPGeAYptKrtsZ');

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
        'image': 'https://starryciels.vercel.app/assets/metaplex/profile.png',
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
                type: 'TransferDelegate',
                authority: { type: 'Address', address: addressProfileCollection },
            },
            {
                type: 'UpdateDelegate',
                authority: { type: 'Address', address: addressProfileCollection },
                additionalDelegates: [
                    addressUpdated
                ]
            },
            {
                type: 'Attributes',
                attributeList: [
                    { key: 'birthday', value: currentDate },
                    { key: 'nickname', value: nickname }
                ]
            }
        ],
    }).sendAndConfirm(umi, txConfig);
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
    }).sendAndConfirm(umi, txConfig);
    return response;
};