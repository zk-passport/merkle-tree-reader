import dotenv from 'dotenv';

dotenv.config();

export enum Mode {
    TRACKER = 'tracker',
    VERIFIER = 'verifier',
}

export const config = {
    mode: (process.env.MODE as Mode) || Mode.VERIFIER,
    port: process.env.PORT || 3300,
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    startBlock: parseInt(process.env.START_BLOCK || '121811899'),
    rpcApi: process.env.RPC_API || '',
    merkleRootCSCA: process.env.MERKLE_ROOT_CSCA || '',
};
