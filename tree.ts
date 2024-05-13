import { poseidon2 } from 'poseidon-lite';
import { LeanIMT } from "@zk-kit/imt"
import fs from 'fs';
import { contractAddress, rpcApi } from './constants';
import { ethers } from 'ethers';

export function createTree(eventsData: any) {
    const leaves: string[] = Object.values(eventsData).map((event: any) => event.commitment);
    const formattedLeaves = leaves.map(BigInt);
    const imt = new LeanIMT((a, b) => poseidon2([a, b]), formattedLeaves);
    return imt;
}

export async function serializeTree(tree: LeanIMT) {
    const serializedTree = tree.export();
    fs.writeFileSync("serialized_tree.json", JSON.stringify(serializedTree));
}

export async function getChainMerkleRoot() {
    const contractABI = JSON.parse(fs.readFileSync('RegisterABI.json', 'utf8'));
    const provider = new ethers.providers.JsonRpcProvider(rpcApi);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const merkleRoot = await contract.getMerkleRoot();
    return merkleRoot;
}

