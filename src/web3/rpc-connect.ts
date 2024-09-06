import { LightSystemProgram, Rpc, createRpc, confirmTx } from '@lightprotocol/stateless.js';
import { createMint, mintTo, transfer } from '@lightprotocol/compressed-token';
import { Keypair } from '@solana/web3.js';

const payer = Keypair.generate();
const tokenRecipient = Keypair.generate();

export const connection: Rpc = createRpc(
    'https://zk-testnet.helius.dev:8899', // rpc
    'https://zk-testnet.helius.dev:8784', // zk compression rpc
    'https://zk-testnet.helius.dev:3001' // prover
);

async function main() {
    let slot = await connection.getSlot();
    let health = await connection.getIndexerHealth();
}

main();