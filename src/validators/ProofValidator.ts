import { verifyProofs, getNullifier, getCommitment } from "@proofofpassport/sdk";
import prisma from '../db';
import { logger } from '../utils/logger';

export class ProofValidator {
    public static async validate(proof: any, proofCSCA: any): Promise<{ isValid: boolean, nullifier?: string }> {
        const isValid = await verifyProofs(proof, proofCSCA);
        if (!isValid) {
            logger.error("Invalid proof.");
            return { isValid: false };
        }

        const nullifier = getNullifier(proof);
        const existing = await prisma.nullifier.findUnique({
            where: { nullifier },
        });

        if (existing) {
            logger.error(`Nullifier ${nullifier} already exists.`);
            return { isValid: false };
        }

        return { isValid: true, nullifier };
    }
}