import { Request, Response } from 'express';
import { MerkleTreeService } from '../services/MerkleTreeService';
import { logger } from '../utils/logger';

export class MerkleTreeController {
    constructor(private merkleTreeService: MerkleTreeService) { }

    public downloadTree = async (req: Request, res: Response) => {
        try {
            const tree = this.merkleTreeService.serializeTree();
            res.json(tree);
            logger.info('Merkle tree downloaded.');
        } catch (error) {
            logger.error('Error downloading merkle tree.');
            res.status(500).send('Error downloading merkle tree.');
        }
    };

    public getRoot = async (req: Request, res: Response) => {
        try {
            const root = this.merkleTreeService.getRoot();
            res.json({ root: root.toString() });
            logger.info('Merkle root retrieved.');
        } catch (error) {
            logger.error('Error retrieving Merkle root.');
            res.status(500).send('Error retrieving Merkle root.');
        }
    };
}
