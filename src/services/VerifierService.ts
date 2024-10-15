import prisma from '../db';
import { MerkleTreeService } from './MerkleTreeService';
import { logger } from '../utils/logger';
import { OpenPassportVerifier, OpenPassportAttestation, OpenPassportDynamicAttestation } from '@proofofpassport/sdk';
import { parsePublicSignalsProve } from '@proofofpassport/sdk/dist/common/src/utils/openPassportAttestation';

export class VerifierService {
    private merkleTreeService: MerkleTreeService;

    constructor(merkleTreeService: MerkleTreeService) {
        this.merkleTreeService = merkleTreeService;
    }

    // Mock verifyProof function
    private async verifyProof(openPassportAttestation: OpenPassportAttestation): Promise<boolean> {
        const openPassportVerifier = new OpenPassportVerifier('register', 'scope', true);
        const isValid = await openPassportVerifier.verify(openPassportAttestation);
        console.log(isValid);
        return isValid.valid;
    }


    public async verifyAndNullify(openPassportAttestation: OpenPassportAttestation): Promise<void> {
        const dynamicAttestation = new OpenPassportDynamicAttestation(openPassportAttestation, 'uuid');
        console.log(dynamicAttestation);
        const nullifier = dynamicAttestation.getNullifier();
        const commitment = dynamicAttestation.getCommitment();
        console.log(nullifier, commitment);

        const isValid = await this.verifyProof(openPassportAttestation);
        if (!isValid) {
            logger.error("Invalid proof.");
            throw new Error("Invalid proof.");
        }
        if (!nullifier || !commitment) {
            logger.error("Proof is missing nullifier or commitment.");
            throw new Error("Invalid proof structure.");
        }
        const cscaMerkleRootHex = dynamicAttestation.getCSCAMerkleRoot();
        const cscaMerkleRoot = BigInt(cscaMerkleRootHex).toString();
        const localMerkleRoot = process.env.MERKLE_ROOT_CSCA;
        if (cscaMerkleRoot !== localMerkleRoot) {
            console.log(cscaMerkleRoot, localMerkleRoot);
            logger.error("CSCA Merkle root does not match.");
            throw new Error("CSCA Merkle root does not match.");
        }

        const existing = await prisma.nullifier.findUnique({
            where: { nullifier },
        });

        if (existing) {
            logger.error(`Nullifier ${nullifier} already exists.`);
            throw new Error("Nullifier already exists.");
        }

        await prisma.nullifier.create({
            data: { nullifier },
        });

        this.merkleTreeService.insertCommitment(commitment);
        await this.merkleTreeService.updateTreeInDB();

        logger.info(`Proof verified and nullifier ${nullifier} recorded.`);
    }
}