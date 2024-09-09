import { Transaction } from "@honeycomb-protocol/edge-client";
import { client } from "@/utils/constants";
import * as web3 from "@solana/web3.js";
import base58 from "bs58";

export async function sendTxns(
  txResponse: Transaction,
  wallet: any,
  connection: web3.Connection
) {
  console.log('Starting sendTxns');
  console.log('Wallet connected:', wallet.connected);
  console.log('Public key:', wallet.publicKey?.toBase58());

  if (!wallet.connected || !wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  try {
    // Deserialize the transaction
    const tx = web3.VersionedTransaction.deserialize(base58.decode(txResponse.transaction));
    console.log('Deserialized transaction:', tx);

    // Sign the transaction
    console.log('Attempting to sign transaction');
    const signedTx = await wallet.signTransaction(tx);
    console.log('Transaction signed successfully');

    // Serialize and send the signed transaction
    const serializedTx = signedTx.serialize();
    console.log('Serialized signed transaction:', base58.encode(serializedTx));

    const signature = await connection.sendRawTransaction(serializedTx, {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    console.log('Transaction sent:', signature);
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('Transaction confirmed');

    return signature;
  } catch (error) {
    console.error('Error in sendTxns:', error);
    throw error;
  }
}