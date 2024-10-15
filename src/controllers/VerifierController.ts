import { Request, Response } from 'express';
import { VerifierService } from '../services/VerifierService';
import { logger } from '../utils/logger';

export class VerifierController {
    constructor(private verifierService: VerifierService) { }

    public register = async (req: Request, res: Response) => {
        try {
            const attestation = req.body;
            await this.verifierService.verifyAndNullify(attestation);
            res.send('User registered successfully');
            logger.info('User registered successfully.');
        } catch (error: any) {
            logger.error(`Registration error: ${error.message}`);
            res.status(500).send(`Registration failed: ${error.message}`);
        }
    };
}