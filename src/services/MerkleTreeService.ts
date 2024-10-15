import { LeanIMT } from "@zk-kit/lean-imt";
import { poseidon2 } from "poseidon-lite";
import prisma from '../db';
import { logger } from '../utils/logger';

export class MerkleTreeService {
    private imt: LeanIMT;

    constructor() {
        this.imt = new LeanIMT((a, b) => poseidon2([a, b]));
        this.initializeTree();
    }

    private async initializeTree() {
        const currentTree = await prisma.tree.findUnique({
            where: { id: "current" },
        });
        if (currentTree) {
            this.imt.import(currentTree.tree);
            logger.info('Merkle tree initialized from database.');
        }
    }

    public insertCommitment(commitment: string) {
        this.imt.insert(BigInt(commitment));
        logger.info(`Inserted commitment: ${commitment}`);
    }

    public getRoot(): bigint {
        return this.imt.root;
    }

    public serializeTree() {
        return this.imt.export();
    }

    public async updateTreeInDB() {
        const serializedTree = this.serializeTree();
        await prisma.tree.upsert({
            where: { id: "current" },
            update: { tree: serializedTree },
            create: { id: "current", tree: serializedTree },
        });
        logger.info('Merkle tree updated in database.');
    }

    public resetTree() {
        this.imt = new LeanIMT((a, b) => poseidon2([a, b]));
        logger.info('Merkle tree reset.');
    }
}
