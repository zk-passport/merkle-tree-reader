import { Router } from 'express';
import { VerifierController } from '../controllers/VerifierController';
import { VerifierService } from '../services/VerifierService';
import { MerkleTreeService } from '../services/MerkleTreeService';

const verifierRoutes = (merkleTreeService: MerkleTreeService) => {
    const router = Router();
    const verifierService = new VerifierService(merkleTreeService);
    const controller = new VerifierController(verifierService);

    router.post('/register', controller.register);

    return router;
};

export default verifierRoutes;
