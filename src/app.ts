import express from 'express';
import { register } from './register';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3300;

app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { proof, proof_csca } = req.body;
        console.log(proof);
        console.log(proof_csca);
        await register(proof, proof_csca);
        res.send('User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send(`Registration failed: ${(error as Error).message}`);
    }
});

app.get('/api/download', (req, res) => {
    const filePath = path.join(process.cwd(), 'serialized_tree.json');
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', err);
            return res.status(404).send('File not found');
        }
        res.download(filePath, 'serialized_tree.json', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                return res.status(500).send('Error downloading file');
            }
        });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});