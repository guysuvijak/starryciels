import { PublicKey } from '@solana/web3.js';
import { Key, FreezeDelegatePlugin } from '@metaplex-foundation/mpl-core';

interface AttributesProps {
    trait_type: 'birthday' | 'nickname' | 'ore' | 'fuel' | 'food';
    value: string;
};

interface AttributesPluginProps {
    attributeList: AttributesProps[];
    authority: { type: string; address: string | undefined; };
    offset: bigint;
};

interface DecodedUriProps {
    attributes: AttributesProps[];
    description: string;
    external_url: string;
    image: string;
    name: string;
    symbol: string;
};

export interface ProfileDataProps {
    attributes?: AttributesPluginProps;
    decodedUri: DecodedUriProps;
    key: Key;
    name: string;
    owner: PublicKey | string;
    publicKey: string;
    freezeDelegate?: FreezeDelegatePlugin;
    updateAuthority: { type: string, address: string };
    uri: string;
};