import express from 'express';
import { config, Mode } from './config';
import merkleTreeRoutes from './routes/merkleTreeRoutes';
import verifierRoutes from './routes/verifierRoutes';
import { EventListener } from './events/EventListener';
import fs from 'fs';
import merkleTreeService from './services/MerkleTreeServiceSingleton';
import { logger } from './utils/logger';

const app = express();

app.use(express.json());

app.use('/api/merkle-tree', merkleTreeRoutes(merkleTreeService));
app.use('/api/verifier', verifierRoutes(merkleTreeService));

if (config.mode === Mode.TRACKER) {
    const contractABI = JSON.parse(fs.readFileSync('src/RegisterABI.json', 'utf8'));
    new EventListener(config.rpcApi, config.contractAddress, contractABI, merkleTreeService);
    logger.info('Merkle Tree Tracker initialized.');
} else if (config.mode === Mode.VERIFIER) {
    logger.info('Verifier mode initialized.');
}

app.listen(Number(config.port), '0.0.0.0', () => {
    logger.info(`Server running on port ${config.port} in ${config.mode} mode.`);
});