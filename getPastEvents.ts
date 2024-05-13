import { ethers } from 'ethers';
import fs from 'fs';
import { contractAddress, startblock, rpcApi } from './constants';
import { EventsData } from './constants';
const provider = new ethers.providers.JsonRpcProvider(rpcApi);

const contractABI = JSON.parse(fs.readFileSync('RegisterABI.json', 'utf8'));
const contract = new ethers.Contract(contractAddress, contractABI, provider);

const filter = {
    address: contractAddress,
    fromBlock: startblock,
    toBlock: 'latest',
    topics: [
        ethers.utils.id("AddCommitment(uint256,uint256,uint256)")
    ]
};

export async function getPastEvents(startBlock = startblock) {
    const updatedFilter = { ...filter, fromBlock: startBlock };
    const events = await contract.queryFilter(updatedFilter);
    const eventsByIndex: EventsData = {};
    if (fs.existsSync('events.json')) {
        const existingEvents = JSON.parse(fs.readFileSync('events.json', 'utf8')) as Record<string, EventsData>;
        Object.assign(eventsByIndex, existingEvents);
    }
    events.forEach(event => {
        const index = event.args ? event.args[0].toString() : 'undefined';
        const commitment = event.args ? parseInt(event.args[1].toString()) : 0;
        const merkleRoot = event.args ? parseInt(event.args[2].toString()) : 0; // Convert to integer
        eventsByIndex[index] = {
            index: parseInt(index),
            commitment: BigInt(commitment),
            merkle_root: BigInt(merkleRoot),
            blockNumber: event.blockNumber ? parseInt(event.blockNumber.toString()) : 0
        };
    });

    fs.writeFileSync('events.json', JSON.stringify(eventsByIndex, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value, 2));
    console.log(`Events updated in events.json`);
    return eventsByIndex;
}
