import axios from 'axios';
import fs from 'fs';
import path from 'path';

const downloadUrl = 'http://localhost:3300/api/download';
const outputPath = path.join(process.cwd(), 'downloaded_tree.json');

async function testDownload() {
    try {
        const response = await axios.get(downloadUrl);
        fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2));
        console.log('Tree downloaded and saved to:', outputPath);
    } catch (error) {
        console.error('Error downloading tree:', error);
    }
}

testDownload();