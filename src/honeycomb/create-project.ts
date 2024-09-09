import { client } from '@/utils/constants';
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { sendTxns } from '@/utils/honeycomb';

const handleCreate = async () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    
    try {
      const params = {
        authority: ('HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH'),
        name: "Starry Ciels",
        payer: ('HQx4BtM2QuGHg3RWmd1axx5JxMj7t5UDzhcm1fosm1uH'),
        profileDataConfig: {
          achievements: [
            "First Achievement",
            "Second Achievement"
          ],
          customDataFields: [
            "NFTs owned",
          ]
        }
      };
      const result = await client.createCreateProjectTransaction(params);
      if (!result || !result.createCreateProjectTransaction) {
        throw new Error('Invalid response from createCreateProjectTransaction');
      }const { project: projectAddress, tx: txResponse }: any = result.createCreateProjectTransaction;
      const signature = await sendTxns(txResponse, wallet, connection);
    } catch (error: any) {
      console.error('Full error:', error);
    }
  };