'use client'
import { fetchAsset } from '@metaplex-foundation/mpl-core';
import { umi } from '@/utils/umi';

export const FetchAsset = async () => {
    const asset = await fetchAsset(umi, '3KSYv6FkHVzfmxLAfJi35PZNoHajix4RA6Tbze66YjTW', {
        skipDerivePlugins: false,
    });
    return asset;
};

const Account = () => {
    return (
        <div>
            <button onClick={() => FetchAsset()}>testset</button>
        </div>
    )
};

export default Account;