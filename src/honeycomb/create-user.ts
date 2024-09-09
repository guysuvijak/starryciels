import { WalletContextState } from '@solana/wallet-adapter-react';
import { type Connection } from '@solana/web3.js';
import { client } from '@/utils/constants';
import { sendTxns } from '@/utils/honeycomb';

const PROJECT_ID = process.env.HC_PROJECT_ID as string;

interface CreateUserProfileProps {
    wallet: WalletContextState;
    connection: Connection;
    name: string;
    username: string;
    pfp: string;
    bio: string;
};

export const CreateUser = async ({wallet, connection, name, username, pfp, bio}: CreateUserProfileProps) => {
    if (!wallet) throw new Error('Please connect wallet');
    if (!connection) throw new Error('Please connect network');
    if (!name || !username || !pfp || !bio) throw new Error('You have entered incomplete information.');

    try {
        const result = await client.createNewUserTransaction({
            wallet: 'HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH',
            info: { name, username, pfp, bio }
        });

        if (!result || !result.createNewUserTransaction) {
            throw new Error('Invalid response from createNewUserTransaction');
          }
        
          const { tx: txResponse }: any = result.createNewUserTransaction;

        if(txResponse) {
            const response = await sendTxns(txResponse, wallet, connection);
            return response;
        } else {
            throw new Error('Error: No transactions returned');
        }
    } catch (err) {
        throw new Error('Error:', err as Error);
    }
};

export const CreateUserProfile = async ({wallet, connection, name, username, pfp, bio}: CreateUserProfileProps) => {
    if (!wallet) throw new Error('Please connect wallet');
    if (!connection) throw new Error('Please connect network');
    if (!name || !username || !pfp || !bio) throw new Error('You have entered incomplete information.');

    try {
        const result = await client.createNewUserWithProfileTransaction({
            project: PROJECT_ID,
            wallet: String(wallet.publicKey?.toBase58()),
            payer: String(wallet.publicKey?.toBase58()),
            userInfo: { name, username, pfp, bio },
            profileInfo: { name, pfp, bio }
        });
        console.log('result',result)

        if (!result || !result.createNewUserWithProfileTransaction) {
            throw new Error('Invalid response from createCreateProjectTransaction');
        }
        
        const { tx: txResponse }: any = result.createNewUserWithProfileTransaction;

        if(txResponse) {
            const response = await sendTxns(txResponse, wallet, connection);
            return response;
        } else {
            throw new Error('Error: No transactions returned');
        }
    } catch (err) {
        throw new Error('Error:', err as Error);
    }
};