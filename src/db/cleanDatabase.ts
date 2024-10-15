import prisma from '../db';
import { logger } from '../utils/logger';
import merkleTreeService from '../services/MerkleTreeServiceSingleton';
import fs from 'fs';
import path from 'path';

async function cleanDatabase() {
    try {
        // Clean database tables
        await prisma.nullifier.deleteMany({});
        await prisma.tree.deleteMany({});

        // Reset MerkleTreeService
        merkleTreeService.resetTree();

        // Delete serialized tree file if it exists
        const serializedTreePath = path.join(__dirname, '..', '..', 'serialized_tree.json');
        if (fs.existsSync(serializedTreePath)) {
            fs.unlinkSync(serializedTreePath);
            logger.info('Serialized tree file deleted.');
        }

        logger.info('Database and Merkle tree cleaned successfully.');
    } catch (error) {
        logger.error(`Error cleaning database and Merkle tree: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
}

cleanDatabase();
