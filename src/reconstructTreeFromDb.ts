import { LeanIMT } from "@zk-kit/lean-imt";
import prisma from './db.js';
import fs from 'fs';
import { poseidon2 } from "poseidon-lite";

export async function reconstructMerkleTree() {
    // Fetch all commitments from the database
    const merkleTreeEntries = await prisma.merkleTree.findMany({
        orderBy: { createdAt: 'asc' },
        select: { commitment: true }
    });

    // Create a new Lean Incremental Merkle Tree
    const imt = new LeanIMT((a, b) => poseidon2([a, b]));

    // Add all commitments to the tree
    for (const entry of merkleTreeEntries) {
        imt.insert(BigInt(entry.commitment));
    }

    // Serialize the tree
    const serializedTree = imt.export();

    return serializedTree;
}
