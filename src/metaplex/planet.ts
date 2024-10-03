import { publicKey, generateSigner, transactionBuilder, sol } from '@metaplex-foundation/umi';
import { fetchCollection, create, fetchAssetsByOwner, update, fetchAsset, fetchAssetsByCollection } from '@metaplex-foundation/mpl-core';
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { umi, DelegateSigner } from '@/utils/umi';

const creator1 = publicKey('HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH');
const addressPlanetCollection = publicKey(process.env.ADDRESS_COLLECTION_PLANET as string);
const addressUpdated = publicKey(process.env.ADDRESS_SIGNER as string);
const masterSigner = publicKey(DelegateSigner);

const randomNickname = (no: number) => {
    const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const numbers = Math.floor(100 + Math.random() * 900).toString();
    return `${letters}-${numbers}-${no}`;
};

const sizeOptions = ['Small', 'Medium', 'Large'];
const surfaceOptions = ['Mountain 1', 'Mountain 2', 'Mountain 3', 'Rough 1', 'Rough 2', 'Rough 3', 'Coarse 1', 'Coarse 2', 'Coarse 3'];
const cloudOptions = ['None', 'Low', 'High'];
const ringsOptions = ['None', '1 Rings', 'X Rings', 'Aura'];

const encodeBitwise = (color: string, size: string, surface: string, cloud: string, rings: string): string => {
    const sizeCode = sizeOptions.indexOf(size).toString().padStart(2, '0');
    const surfaceCode = surfaceOptions.indexOf(surface).toString().padStart(2, '0');
    const cloudCode = cloudOptions.indexOf(cloud).toString().padStart(2, '0');
    const ringsCode = ringsOptions.indexOf(rings).toString().padStart(2, '0');
    
    return `${color}${sizeCode}${surfaceCode}${cloudCode}${ringsCode}`;
};

const randomPlanetAttributes = (no: number) => {
    const randomColor = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    const randomFromArray = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const color = randomColor();
    const size = randomFromArray(sizeOptions);
    const surface = randomFromArray(surfaceOptions);
    const cloud = randomFromArray(cloudOptions);
    const rings = randomFromArray(ringsOptions);

    const code = encodeBitwise(color, size, surface, cloud, rings);
    const birthday = new Date().toISOString();
    const planet = randomNickname(no);
    
    const attributes = [
        { trait_type: 'birthday', value: birthday },
        { trait_type: 'planet', value: planet },
        { trait_type: 'code', value: code }
    ];

    const attributesList = [
        { key: 'birthday', value: birthday },
        { key: 'planet', value: planet },
        { key: 'color', value: color },
        { key: 'size', value: size },
        { key: 'surface', value: surface },
        { key: 'cloud', value: cloud },
        { key: 'rings', value: rings },
        { key: 'code', value: code }
    ];

    return { attributes, attributesList };
};

export const CreatePlanet = async (owner: string) => {
    const assetSigner = generateSigner(umi);
    const ownerPublicKey = publicKey(owner);

    const collection = await fetchCollection(umi, addressPlanetCollection);
    const metadataName = `StarryCiels Planet #${collection.numMinted}`;
    const { attributes, attributesList } = randomPlanetAttributes(collection.numMinted);

    const metadata = {
        'name': metadataName,
        'image': 'https://gateway.pinata.cloud/ipfs/QmcgpFxeN7Ecfwux8TMCu84jAkhtSNjiJNm8AJuHUwLSLR',
        'external_url': 'https://starryciels.vercel.app',
        'attributes': attributes
    };
    const metadataString = JSON.stringify(metadata);
    const metadataBase64 = Buffer.from(metadataString).toString('base64');
    const base64Uri = `data:application/json;base64,${metadataBase64}`;

    const tx = transactionBuilder()
        .add(create(umi, {
            name: metadataName,
            uri: base64Uri,
            asset: assetSigner,
            owner: ownerPublicKey,
            collection: collection,
            plugins: [
                {
                    type: 'TransferDelegate',
                    authority: { type: 'Address', address: masterSigner },
                },
                {
                    type: 'UpdateDelegate',
                    authority: { type: 'Address', address: masterSigner },
                    additionalDelegates: []
                },
                {
                    type: 'Attributes',
                    attributeList: attributesList
                }
            ],
        }));

    try {
        const response = await tx.sendAndConfirm(umi);
        return { response, assetAddress: assetSigner.publicKey };
    } catch (error) {
        console.error('Failed to create planet:', error);
        throw new Error('Failed to create planet. Transaction failed.');
    }
};

export const FetchPlanet = async (assetId: any) => {
    const asset = await fetchAsset(umi, assetId);
    return asset;
};

export const FetchOwnPlanet = async (owner: string) => {
    const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
        skipDerivePlugins: false
    })
    const collectionAssets = assetsByOwner.filter((asset: any) => 
        asset.updateAuthority.type === 'Collection' && asset.updateAuthority.address.toString() === addressPlanetCollection.toString()
    );
    return collectionAssets;
};

export const FetchOtherPlanet = async () => {
    const assetsByCollection = await fetchAssetsByCollection(umi, addressPlanetCollection, {
        skipDerivePlugins: false
    });
    return assetsByCollection;
};

export const UpdatePlanet = async (owner: string, assetId: any) => {
    const asset = await fetchAsset(umi, assetId);
    const base64Data = asset.uri.split(',')[1];
    const jsonString = atob(base64Data);
    const metadata = JSON.parse(jsonString);
    const updatedJsonString = JSON.stringify(metadata);
    const updatedBase64 = btoa(updatedJsonString);
    const newUri = `data:application/json;base64,${updatedBase64}`;
    const response = await update(umi, {
        asset: asset,
        uri: newUri
    }).sendAndConfirm(umi);
    return response;
};