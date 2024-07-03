import { cleanDatabase, closePrismaClient } from './dbOperations.js';

async function main() {
    await cleanDatabase();
    await closePrismaClient();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});