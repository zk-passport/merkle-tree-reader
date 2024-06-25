const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000; // You can change the port number if needed
const path = require('path');
const fs = require('fs');

app.get('/status', (req, res) => {
    res.json({ status: 'ok' });
});

// Update merkle tree
app.get('/api/update-merkle-tree', (req, res) => {
    exec('ts-node clientRequest.ts', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Script execution failed: ${error}`);
        }
        res.send(`Script executed successfully: ${stdout}`);
    });
});

// Download merkle tree
app.get('/api/download', (req, res) => {
    const filePath = path.join(__dirname, 'serialized_tree.json');
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

// Update and download merkle tree
app.get('/api/download-merkle-tree', (req, res) => {
    exec('ts-node clientRequest.ts', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Script execution failed: ${error}`);
        }

        console.log(`Script executed successfully: ${stdout}`);

        const filePath = path.join(__dirname, 'serialized_tree.json');

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
});


// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});