'use client'
import React, { useState, useEffect } from 'react';
import {
  LightSystemProgram,
  Rpc,
  confirmTx,
  createRpc,
  defaultTestStateTreeAccounts,
} from "@lightprotocol/stateless.js";
import { createMint, mintTo, transfer } from "@lightprotocol/compressed-token";
import { Keypair, Connection, PublicKey, Transaction, ComputeBudgetProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from 'bs58';

const payer = Keypair.generate();
const tokenRecipient = Keypair.generate();

const ALCHEMY_RPC_URL = 'https://solana-devnet.g.alchemy.com/v2/gX5S9YyAztryl3vb09nqaG9UVsvrUkmJ';
const LIGHT_PROTOCOL_RPC_URL = 'https://zk-testnet.helius.dev:8899';

const Web3 = () => {
  const [status, setStatus] = useState('');
  const [connection, setConnection] = useState<Connection | null>(null);
  const [lightConnection, setLightConnection] = useState<Rpc | null>(null);
  const [nftData, setNFTData] = useState<any>(null);
  const [signature, setSignature] = useState('');
  const [storeAccount, setStoreAccount] = useState(null);
  const svg = '<svg width="160" height="160" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#181425" d="M234 189h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-117 9h9v9h-9zm27 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm45 0h9v9h-9zm36 0h9v9h-9zm81 0h9v9h-9zm-171 9h9v9h-9zm63 0h9v9h-9zm18 0h9v9h-9zm99 0h9v9h-9zm9 0h9v9h-9zm-198 9h9v9h-9zm81 0h9v9h-9zm126 0h9v9h-9zm-216 9h9v9h-9zm225 0h9v9h-9zm9 0h9v9h-9zm-234 9h9v9h-9zm243 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm315 0h9v9h-9zm9 0h9v9h-9zm-378 9h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm342 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-414 9h9v9h-9zm423 0h9v9h-9zm-423 9h9v9h-9zm432 0h9v9h-9zm-423 9h9v9h-9zm414 0h9v9h-9zm-414 9h9v9h-9zm414 0h9v9h-9zm-414 9h9v9h-9zm405 0h9v9h-9zm-396 9h9v9h-9zm396 0h9v9h-9zm-405 9h9v9h-9zm9 0h9v9h-9zm387 0h9v9h-9zm-405 9h9v9h-9zm396 0h9v9h-9zm-405 9h9v9h-9zm387 0h9v9h-9zm9 0h9v9h-9zm-387 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm342 0h9v9h-9zm-333 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm297 0h9v9h-9zm-288 9h9v9h-9zm279 0h9v9h-9zm-270 9h9v9h-9zm261 0h9v9h-9zm-252 9h9v9h-9zm243 0h9v9h-9zm-243 9h9v9h-9zm234 0h9v9h-9zm-225 9h9v9h-9zm207 0h9v9h-9zm9 0h9v9h-9zm-216 9h9v9h-9zm225 0h9v9h-9zm9 0h9v9h-9zm-234 9h9v9h-9zm243 0h9v9h-9zm9 0h9v9h-9zm-252 9h9v9h-9zm261 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-279 9h9v9h-9zm288 0h9v9h-9zm-288 9h9v9h-9zm297 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-315 9h9v9h-9zm324 0h9v9h-9zm9 0h9v9h-9zm-333 9h9v9h-9zm342 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm360 0h9v9h-9zm-369 9h9v9h-9zm378 0h9v9h-9zm-378 9h9v9h-9zm387 0h9v9h-9zm-387 9h9v9h-9zm396 0h9v9h-9zm-396 9h9v9h-9zm396 0h9v9h-9zm-396 9h9v9h-9zm405 0h9v9h-9zm-396 9h9v9h-9zm396 0h9v9h-9zm-396 9h9v9h-9zm405 0h9v9h-9zm-396 9h9v9h-9zm396 0h9v9h-9zm-387 9h9v9h-9zm396 0h9v9h-9zm-387 9h9v9h-9zm315 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm-378 9h9v9h-9zm135 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm-378 9h9v9h-9zm9 0h9v9h-9zm108 0h9v9h-9zm27 0h9v9h-9zm54 0h9v9h-9zm45 0h9v9h-9zm45 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm-360 9h9v9h-9zm90 0h9v9h-9zm45 0h9v9h-9zm54 0h9v9h-9zm45 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm27 0h9v9h-9zm-360 9h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm45 0h9v9h-9zm54 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm54 0h9v9h-9zm27 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm45 0h9v9h-9zm45 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm18 0h9v9h-9zm-315 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm180 0h9v9h-9z"/><path fill="#303855" d="M234 198h9v9h-9zm90 0h9v9h-9zm-99 9h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-108 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-117 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-117 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm90 0h9v9h-9zm-207 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-234 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-234 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-261 9h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm108 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-378 9h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm90 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-360 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-315 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-252 9h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-207 9h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-171 9h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm-180 9h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm-171 9h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm-126 9h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm-90 9h9v9h-9zm54 0h9v9h-9zm18 0h9v9h-9zm99 63h9v9h-9zm-81 9h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm-180 9h9v9h-9zm63 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-171 9h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-180 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm-216 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-243 9h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-252 9h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-243 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-252 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-261 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm-261 9h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm-270 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm-270 9h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm63 0h9v9h-9zm-270 9h9v9h-9zm9 0h9v9h-9zm108 0h9v9h-9zm90 0h9v9h-9zm-198 9h9v9h-9zm9 0h9v9h-9zm108 0h9v9h-9zm90 0h9v9h-9zm-189 9h9v9h-9zm9 9h9v9h-9z"/><path fill="#3A4466" d="M243 198h9v9h-9zm90 0h9v9h-9zm9 0h9v9h-9zm-99 9h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-126 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-135 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-135 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm36 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-333 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-234 9h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-135 9h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm-99 9h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm18 198h9v9h-9zm54 0h9v9h-9zm-63 9h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm-135 9h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm-144 9h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-207 9h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-225 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-225 9h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm-243 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm-243 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-171 9h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-171 9h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-189 9h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9z"/><path fill="#220E24" d="M135 261h9v9h-9zm9 9h9v9h-9zm9 9h9v9h-9zm387 0h9v9h-9zm-378 9h9v9h-9zm369 0h9v9h-9zm-360 9h9v9h-9zm360 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm333 0h9v9h-9zm-324 9h9v9h-9zm9 0h9v9h-9zm306 0h9v9h-9zm-297 9h9v9h-9zm288 0h9v9h-9zm-279 9h9v9h-9zm9 0h9v9h-9zm252 0h9v9h-9zm9 0h9v9h-9zm-252 9h9v9h-9zm234 0h9v9h-9zm-225 9h9v9h-9zm216 0h9v9h-9zm-207 9h9v9h-9zm198 0h9v9h-9zm-198 9h9v9h-9zm189 0h9v9h-9zm-180 9h9v9h-9zm153 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-162 9h9v9h-9zm135 0h9v9h-9zm-135 9h9v9h-9zm126 0h9v9h-9zm-126 9h9v9h-9zm126 0h9v9h-9zm-117 9h9v9h-9zm117 0h9v9h-9zm-117 9h9v9h-9zm126 0h9v9h-9zm-126 9h9v9h-9zm135 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm162 0h9v9h-9zm-171 9h9v9h-9zm180 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-198 9h9v9h-9zm207 0h9v9h-9zm9 0h9v9h-9zm-216 9h9v9h-9zm225 0h9v9h-9zm-225 9h9v9h-9zm234 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-261 9h9v9h-9zm270 0h9v9h-9zm9 0h9v9h-9zm-279 9h9v9h-9zm288 0h9v9h-9zm-288 9h9v9h-9zm297 0h9v9h-9zm-297 9h9v9h-9zm306 0h9v9h-9zm-297 9h9v9h-9zm306 0h9v9h-9zm-306 9h9v9h-9zm315 0h9v9h-9zm-306 9h9v9h-9zm306 0h9v9h-9zm-306 9h9v9h-9zm315 0h9v9h-9zm-306 9h9v9h-9zm315 0h9v9h-9zm-306 9h9v9h-9zm306 0h9v9h-9zm-297 9h9v9h-9zm306 0h9v9h-9zm-297 9h9v9h-9zm9 9h9v9h-9zm9 0h9v9h-9zm9 9h9v9h-9zm9 0h9v9h-9zm9 9h9v9h-9z"/><path fill="#C0CBDC" d="M135 270h9v9h-9zm0 9h9v9h-9zm387 36h9v9h-9zm-9 9h9v9h-9zm-360 9h9v9h-9zm18 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm252 0h9v9h-9zm-297 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm-36 9h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm225 0h9v9h-9zm-261 9h9v9h-9zm9 0h9v9h-9zm243 0h9v9h-9zm-243 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm198 0h9v9h-9zm-234 9h9v9h-9zm18 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm180 0h9v9h-9zm-207 9h9v9h-9zm18 0h9v9h-9zm171 0h9v9h-9zm9 0h9v9h-9zm-198 9h9v9h-9zm18 0h9v9h-9zm-9 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm-18 9h9v9h-9zm189 0h9v9h-9zm9 0h9v9h-9zm-225 9h9v9h-9zm27 0h9v9h-9zm198 0h9v9h-9zm-225 9h9v9h-9zm27 0h9v9h-9zm207 0h9v9h-9zm-234 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm225 0h9v9h-9zm-243 9h9v9h-9zm27 0h9v9h-9zm234 0h9v9h-9zm-261 9h9v9h-9zm9 0h9v9h-9zm261 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm288 0h9v9h-9zm9 0h9v9h-9zm-306 9h9v9h-9zm9 0h9v9h-9zm306 0h9v9h-9zm9 0h9v9h-9zm-324 9h9v9h-9zm9 0h9v9h-9zm315 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm9 0h9v9h-9zm333 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm342 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm360 0h9v9h-9zm-360 9h9v9h-9zm9 9h9v9h-9zm-9 9h9v9h-9zm9 0h9v9h-9zm-9 9h9v9h-9zm9 0h9v9h-9z"/><path fill="#EFF2F6" d="M144 279h9v9h-9zm405 0h9v9h-9zm-396 9h9v9h-9zm387 0h9v9h-9zm-396 18h9v9h-9zm9 9h9v9h-9zm9 9h9v9h-9zm45 0h9v9h-9zm-72 9h9v9h-9zm45 0h9v9h-9zm36 0h9v9h-9zm288 0h9v9h-9zm-378 9h9v9h-9zm81 0h9v9h-9zm18 0h9v9h-9zm270 0h9v9h-9zm-333 9h9v9h-9zm72 0h9v9h-9zm252 0h9v9h-9zm-243 9h9v9h-9zm9 9h9v9h-9zm0 27h9v9h-9zm0 9h9v9h-9zm216 27h9v9h-9zm9 9h9v9h-9zm9 0h9v9h-9zm9 9h9v9h-9zm-261 9h9v9h-9zm279 0h9v9h-9zm-279 9h9v9h-9zm306 0h9v9h-9zm18 9h9v9h-9zm-333 9h9v9h-9zm360 0h9v9h-9zm9 9h9v9h-9zm9 9h9v9h-9zm-378 18h9v9h-9zm18 0h9v9h-9zm-9 18h9v9h-9zm18 0h9v9h-9zm-9 9h9v9h-9z"/><path fill="#FFF" d="M144 288h9v9h-9zm0 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm378 0h9v9h-9zm-387 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm360 0h9v9h-9zm-369 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm342 0h9v9h-9zm-360 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm324 0h9v9h-9zm-378 9h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm306 0h9v9h-9zm-378 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm54 0h9v9h-9zm-45 9h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 9h9v9h-9zm9 9h9v9h-9zm9 9h9v9h-9zm0 9h9v9h-9zm225 45h9v9h-9zm18 9h9v9h-9zm9 0h9v9h-9zm0 9h9v9h-9zm9 0h9v9h-9zm9 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 9h9v9h-9zm9 0h9v9h-9zm-324 9h9v9h-9zm333 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm342 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm-9 9h9v9h-9zm9 0h9v9h-9zm-9 9h9v9h-9zm9 0h9v9h-9zm0 9h9v9h-9zm0 9h9v9h-9zm9 0h9v9h-9zm0 9h9v9h-9z"/><path fill="#262B44" d="M522 297h9v9h-9zm-297 9h9v9h-9zm9 0h9v9h-9zm279 0h9v9h-9zm-279 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm144 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-261 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm36 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-243 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm36 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-225 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm63 0h9v9h-9zm63 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-198 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm63 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm-180 9h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm-162 9h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm45 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm-144 9h9v9h-9zm27 0h9v9h-9zm45 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm-108 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-108 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-108 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-99 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-99 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-108 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-117 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-153 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-162 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm-189 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm-207 9h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm27 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-225 9h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm72 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-252 9h9v9h-9zm27 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-270 9h9v9h-9zm27 0h9v9h-9zm27 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-279 9h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm81 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-270 9h9v9h-9zm9 0h9v9h-9zm72 0h9v9h-9zm9 0h9v9h-9zm126 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm135 0h9v9h-9zm9 0h9v9h-9zm45 0h9v9h-9zm9 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm198 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm9 0h9v9h-9zm198 0h9v9h-9zm-288 9h9v9h-9zm9 0h9v9h-9zm81 0h9v9h-9zm207 0h9v9h-9zm-288 9h9v9h-9zm81 0h9v9h-9zm-72 9h9v9h-9zm9 9h9v9h-9z"/><path fill="#8B9BB4" d="M153 324h9v9h-9zm9 9h9v9h-9zm9 0h9v9h-9zm27 9h9v9h-9zm18 9h9v9h-9zm261 0h9v9h-9zm-279 9h9v9h-9zm27 0h9v9h-9zm243 0h9v9h-9zm-261 9h9v9h-9zm27 0h9v9h-9zm225 0h9v9h-9zm-243 9h9v9h-9zm234 0h9v9h-9zm-216 9h9v9h-9zm189 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-216 9h9v9h-9zm9 0h9v9h-9zm36 0h9v9h-9zm144 0h9v9h-9zm9 0h9v9h-9zm-189 9h9v9h-9zm36 0h9v9h-9zm144 0h9v9h-9zm9 0h9v9h-9zm-189 9h9v9h-9zm9 0h9v9h-9zm27 0h9v9h-9zm144 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-207 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm144 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-198 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm171 0h9v9h-9zm-207 9h9v9h-9zm9 0h9v9h-9zm18 0h9v9h-9zm9 0h9v9h-9zm180 0h9v9h-9zm-207 9h9v9h-9zm18 0h9v9h-9zm-18 9h9v9h-9zm9 0h9v9h-9zm0 9h9v9h-9zm9 0h9v9h-9zm-9 9h9v9h-9zm9 0h9v9h-9zm-9 9h9v9h-9zm0 9h9v9h-9zm0 9h9v9h-9zm315 0h9v9h-9zm-315 9h9v9h-9zm324 0h9v9h-9zm-324 9h9v9h-9zm9 0h9v9h-9zm324 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm9 0h9v9h-9zm333 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm9 0h9v9h-9zm324 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm333 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm333 0h9v9h-9zm9 0h9v9h-9zm-369 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm324 0h9v9h-9zm9 0h9v9h-9zm-360 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm324 0h9v9h-9zm9 0h9v9h-9zm-351 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm315 0h9v9h-9zm9 0h9v9h-9zm-342 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm315 0h9v9h-9zm9 0h9v9h-9zm-333 9h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm9 0h9v9h-9zm306 0h9v9h-9zm9 0h9v9h-9zm-306 9h9v9h-9zm9 0h9v9h-9zm297 0h9v9h-9z"/></svg>';
  const [metadata, setMetadata] = useState({
    name: 'Cosmic Star',
    description: 'starryciels',
    image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  });

  useEffect(() => {
    const newConnection = new Connection(ALCHEMY_RPC_URL, 'confirmed');
    setConnection(newConnection);

    const newLightConnection = createRpc(
      ALCHEMY_RPC_URL,
      LIGHT_PROTOCOL_RPC_URL,
      'https://zk-testnet.helius.dev:3001' // prover URL
    );
    setLightConnection(newLightConnection);
    const createStoreAccount = async () => {
      if (connection && lightConnection) {
        try {
          const { store } = await createStore(connection, payer);
          setStoreAccount(store);
          console.log('Store account created:', store.toBase58());
        } catch (error) {
          console.error('Error creating store account:', error);
        }
      }
    };

    createStoreAccount();
  }, [connection, lightConnection]);

  const waitForTransactionConfirmation = async (
    connection: Connection,
    signature: string,
    timeout = 120000 // 2 minutes
  ): Promise<boolean> => {
    const start = Date.now();
    let status = await connection.getSignatureStatus(signature);
    
    while (Date.now() - start < timeout) {
      if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before checking again
      status = await connection.getSignatureStatus(signature);
    }
    
    return false; // Timeout reached
  };

  const requestAirdrop = async (connection: Connection, publicKey: PublicKey, amount: number): Promise<boolean> => {
    try {
      const airdropSignature = await connection.requestAirdrop(publicKey, amount);
      console.log('Airdrop requested. Signature:', airdropSignature);
      
      const confirmed = await waitForTransactionConfirmation(connection, airdropSignature);
      if (confirmed) {
        console.log('Airdrop confirmed');
        return true;
      } else {
        console.log('Airdrop confirmation timeout');
        return false;
      }
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      return false;
    }
  };

  const mintNFT = async () => {
    if (!connection || !lightConnection) {
      setStatus('Error: Connection not established');
      return;
    }

    try {
      setStatus('Preparing to mint NFT...');
      
      const requiredBalance = 2 * LAMPORTS_PER_SOL; // 2 SOL
      let currentBalance = await connection.getBalance(payer.publicKey);
      console.log('Current balance:', currentBalance);
      
      while (currentBalance < requiredBalance) {
        setStatus(`Requesting airdrop... Current balance: ${currentBalance / LAMPORTS_PER_SOL} SOL`);
        const airdropAmount = Math.min(requiredBalance - currentBalance, LAMPORTS_PER_SOL);
        const airdropSuccess = await requestAirdrop(connection, payer.publicKey, airdropAmount);
        
        if (!airdropSuccess) {
          throw new Error('Failed to receive airdrop');
        }
        
        currentBalance = await connection.getBalance(payer.publicKey);
        console.log('Updated balance after airdrop:', currentBalance);
      }

      console.log('Creating compress instruction...');
      const metadataString = JSON.stringify(metadata);
      const metadataBuffer = Buffer.from(metadataString);
      
      // Encode metadata properly
      const encodedMetadata = metadataBuffer.toString('base64');
      console.log('Encoded metadata:', encodedMetadata);
      
      const compressInstruction = await LightSystemProgram.compress({
        payer: payer.publicKey,
        toAddress: payer.publicKey,
        lamports: 1,
        outputStateTree: defaultTestStateTreeAccounts().merkleTree,
        metadata: encodedMetadata,
      });
      console.log('Compress instruction created:', compressInstruction);

      console.log('Creating transaction...');
      const transaction = new Transaction();
      
      transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 1000000
        })
      );
      
      transaction.add(compressInstruction);
      console.log('Transaction created:', transaction);

      console.log('Setting fee payer and recent blockhash...');
      transaction.feePayer = payer.publicKey;
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      console.log('Recent blockhash:', blockhash);

      console.log('Sending transaction...');
      const signature = await connection.sendTransaction(transaction, [payer]);
      console.log('Transaction sent. Signature:', signature);

      console.log('Waiting for transaction confirmation...');
      const confirmed = await waitForTransactionConfirmation(connection, signature);
      
      if (confirmed) {
        console.log(`NFT minted successfully! Transaction signature: ${signature}`);
        setStatus(`NFT minted successfully! Transaction signature: ${signature}`);
      } else {
        throw new Error('Transaction confirmation timeout');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      setStatus(`Error minting NFT: ${error.message}`);
    }
  };

  const fetchNFTData = async () => {
    if (!connection || !lightConnection || !signature) {
      setStatus('Error: Connection not established or signature not provided');
      return;
    }
  
    try {
      setStatus('Fetching NFT data...');
      
      const tx = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      });
      if (!tx) {
        setStatus('Error: Transaction not found');
        return;
      }
  
      console.log('Full Transaction:', JSON.stringify(tx, null, 2));
  
      // Log all instructions
      console.log('All instructions:');
      tx.transaction.message.instructions.forEach((instruction, index) => {
        console.log(`Instruction ${index}:`, instruction);
        if (instruction.programId) {
          console.log(`ProgramId:`, tx.transaction.message.accountKeys[instruction.programIdIndex].toBase58());
        }
      });
  
      // Find the Light Protocol instruction
      const lightProtocolInstruction = tx.transaction.message.instructions.find((ix) => {
        const programId = tx.transaction.message.accountKeys[ix.programIdIndex].toBase58();
        return programId === 'SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7';
      });
  
      if (!lightProtocolInstruction) {
        setStatus('Error: Light Protocol instruction not found in transaction');
        return;
      }
  
      console.log('Light Protocol instruction found:', lightProtocolInstruction);
  
      // Attempt to decode the instruction data
      try {
        // Note: You might need to adjust this part based on how Light Protocol encodes its instruction data
        const decodedData = bs58.decode(lightProtocolInstruction.data);
      console.log('Decoded data:', decodedData.toString());
  
      // Extract metadata from the decoded data
      // Note: This is a simplified example. You may need to adjust based on the actual data structure
      const metadataStart = decodedData.indexOf('{');
      const metadataEnd = decodedData.lastIndexOf('}') + 1;
      const metadataJSON = decodedData.slice(metadataStart, metadataEnd).toString();
      
      let metadataObj = {};
      try {
        // Convert the entire decoded data to a string
        const dataString = decodedData.toString('utf-8');
        console.log('Data as string:', dataString);

        // Try to find a base64 encoded JSON string
        const base64Regex = /[A-Za-z0-9+/=]{20,}/;
        const base64Match = dataString.match(base64Regex);
        
        if (base64Match) {
          const base64String = base64Match[0];
          console.log('Potential base64 string found:', base64String);
          
          // Decode the base64 string
          const decodedMetadata = Buffer.from(base64String, 'base64').toString('utf-8');
          console.log('Decoded metadata string:', decodedMetadata);
          
          // Parse the JSON
          metadataObj = JSON.parse(decodedMetadata);
        } else {
          console.log('No potential base64 encoded metadata found');
        }
      } catch (parseError) {
        console.error('Error parsing metadata:', parseError);
      }
  
      const nftDataResult = {
        instruction: lightProtocolInstruction,
        decodedData: decodedData.toString(),
        metadata: metadataObj
      };
  
      setNFTData(nftDataResult);
      setStatus('NFT data fetched successfully');
      console.log('NFT Data:', nftDataResult);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      setStatus(`Error fetching NFT data: ${error.message}`);
    }
  
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      setStatus(`Error fetching NFT data: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4 bg-white p-4">
      <div>
        <input
          type="text"
          placeholder="NFT Name"
          value={metadata.name}
          onChange={(e) => setMetadata({...metadata, name: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="NFT Description"
          value={metadata.description}
          onChange={(e) => setMetadata({...metadata, description: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <button onClick={mintNFT} className='bg-blue-500 p-4 text-white rounded'>Mint NFT</button>
      </div>
      <p>{status}</p>
      <div>
        <input
          type="text"
          placeholder="Enter transaction signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={fetchNFTData} className="bg-green-500 p-2 text-white rounded mt-2">
          Fetch NFT Data
        </button>
      </div>
      {nftData && (
        <div>
          <h2 className="text-xl font-bold">NFT Data:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Name:</strong> {nftData.metadata.name || 'N/A'}</p>
            <p><strong>Description:</strong> {nftData.metadata.description || 'N/A'}</p>
            {nftData.metadata.image && (
              <div>
                <p><strong>Image:</strong></p>
                <img 
                  src={nftData.metadata.image}
                  alt="NFT Image" 
                  className="max-w-full h-auto mt-2"
                />
              </div>
            )}
          </div>
          <pre className="bg-gray-100 p-2 rounded mt-4">
            {JSON.stringify(nftData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default Web3;