import axios from 'axios';
import fs from 'fs';
import path from 'path';

const testRetrieveMerkleTree = async () => {
    try {
        const response = await axios.get('http://localhost:3300/api/merkle-tree/download');
        const treeData = response.data;
        console.log('Merkle Tree:', treeData);

        // Optionally, save the tree to a local file
        const outputPath = path.join(__dirname, 'downloaded_merkle_tree.json');
        fs.writeFileSync(outputPath, JSON.stringify(treeData, null, 2));
        console.log(`Merkle tree saved to ${outputPath}`);
    } catch (error: any) {
        if (error.response) {
            console.error(`Error: ${error.response.status} - ${error.response.data}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
};

testRetrieveMerkleTree();