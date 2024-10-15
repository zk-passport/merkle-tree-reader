
import prisma from '../db';

// Clean database
export async function cleanDatabase() {
    await prisma.nullifier.deleteMany({});
    await prisma.tree.deleteMany({});
    console.log('Database cleaned successfully');
}

// Retrieve nullifiers
export async function retrieveNullifiers() {
    const nullifiers = await prisma.nullifier.findMany({
        select: { nullifier: true },
        orderBy: { createdAt: 'asc' }
    });
    console.log('Nullifiers:', nullifiers.map(n => n.nullifier));
    return nullifiers;
}

// Retrieve merkle tree
export async function retrieveMerkleTree() {
    const merkleTree = await prisma.tree.findMany({
        orderBy: { updatedAt: 'asc' }
    });
    console.log('Merkle Tree:', merkleTree);
    return merkleTree;
}

// Close Prisma client (call this at the end of your scripts)
export async function closePrismaClient() {
    await prisma.$disconnect();
}