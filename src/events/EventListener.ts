import { ethers } from 'ethers';
import fs from 'fs';
import { MerkleTreeService } from '../services/MerkleTreeService';
import { readJSONFile, writeJSONFile } from '../utils/fileUtils';
import { logger } from '../utils/logger';

interface EventData {
    index: number;
    commitment: BigInt;
    merkle_root: BigInt;
    blockNumber: number;
}

export class EventListener {
    private provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;
    private merkleTreeService: MerkleTreeService;
    private eventsData: Record<string, EventData>;

    constructor(
        rpcApi: string,
        contractAddress: string,
        contractABI: any,
        merkleTreeService: MerkleTreeService
    ) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcApi);
        this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);
        this.merkleTreeService = merkleTreeService;
        this.eventsData = readJSONFile<Record<string, EventData>>('events.json') || {};
        this.listenToEvents();
    }

    private listenToEvents() {
        this.contract.on('AddCommitment', async (index, commitment, merkle_root, event) => {
            const blockNumber = event.blockNumber;
            this.eventsData[index.toString()] = {
                index: index.toNumber(),
                commitment: commitment.toBigInt(),
                merkle_root: merkle_root.toBigInt(),
                blockNumber,
            };
            writeJSONFile('events.json', this.eventsData);
            this.merkleTreeService.insertCommitment(commitment.toString());
            await this.merkleTreeService.updateTreeInDB();
            logger.info(`New commitment added from block ${blockNumber}.`);
        });
    }
}