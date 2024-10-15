import { retrieveNullifiers, retrieveMerkleTree, closePrismaClient } from './dbOperations.js';

async function main() {
    console.log('Retrieving Nullifiers:');
    await retrieveNullifiers();

    console.log('\nRetrieving Merkle Tree:');
    await retrieveMerkleTree();

    await closePrismaClient();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});