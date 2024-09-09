import { WalletContextState } from "@solana/wallet-adapter-react";
import { Transactions } from "@honeycomb-protocol/edge-client";
import { client } from "@/utils/constants";
import * as web3 from "@solana/web3.js";
import base58 from "bs58";

export async function sendTxns(
  wallet: any,
  txResponse: Transactions
) {
  const allTxns = txResponse.transactions.map((txStr: string) => {
    let tn = web3.VersionedTransaction.deserialize(base58.decode(txStr));
    tn.message.recentBlockhash = txResponse.blockhash;
    return tn;
  });
  
  const txs = await wallet.signAllTransactions(allTxns)
    .then((txs: any) => {
      return txs.map((tx: any) => base58.encode(tx.serialize()));
    })
    .catch((e: any) => {
      console.error("Failed to sign transactions: ", e);
      throw new Error(e);
    });

  await client.sendBulkTransactions({
    txs,
    blockhash: txResponse!.blockhash,
    lastValidBlockHeight: txResponse!.lastValidBlockHeight,
    options: {
      skipPreflight: true,
    },
  });
}