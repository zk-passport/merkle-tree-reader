import { Router } from 'express';
import { MerkleTreeController } from '../controllers/MerkleTreeController';
import { MerkleTreeService } from '../services/MerkleTreeService';

const merkleTreeRoutes = (merkleTreeService: MerkleTreeService) => {
    const router = Router();
    const controller = new MerkleTreeController(merkleTreeService);

    router.get('/download', controller.downloadTree);
    router.get('/root', controller.getRoot); // New route to retrieve the Merkle root

    return router;
};

export default merkleTreeRoutes;
