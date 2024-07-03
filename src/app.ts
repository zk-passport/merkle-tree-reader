import express from 'express';
import { register } from './register.js';
import prisma from './db.js';
import { LeanIMT } from "@zk-kit/lean-imt";
import { poseidon2 } from "poseidon-lite";

const app = express();
const port = 3300;

app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { proof, proof_csca } = req.body;
        await register(proof, proof_csca);
        res.send('User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send(`Registration failed: ${(error as Error).message}`);
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const latestTree = await prisma.tree.findFirst({
            orderBy: { updatedAt: 'desc' }
        });
        console.log(latestTree);

        if (!latestTree) {
            return res.status(404).send('No tree found');
        }

        // let imt = new LeanIMT((a, b) => poseidon2([a, b]));
        // imt.import(latestTree.tree);

        // const reconstructedTree = {
        //     root: imt.root.toString(),
        //     leaves: imt.leaves.map(leaf => leaf.toString()),
        //     // Add any other relevant information you want to include
        // };

        res.json(latestTree.tree);
    } catch (error) {
        console.error('Error reconstructing tree:', error);
        res.status(500).send('Error reconstructing tree');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
