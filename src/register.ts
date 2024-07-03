import { getNullifier, verifyProofs, Proof, check_merkle_root, getCommitment } from "@proofofpassport/sdk";
import { merkle_root_csca } from "./constants.js";
import prisma from './db.js';
import { LeanIMT } from "@zk-kit/lean-imt";
import { poseidon2 } from "poseidon-lite";

export async function register(proof: Proof, proof_csca: Proof) {
    const result = await verifyProofs(proof, proof_csca);
    const checkRoot = check_merkle_root(merkle_root_csca, proof_csca);

    if (checkRoot && result) {
        const nullifier = getNullifier(proof);

        const existingNullifier = await prisma.nullifier.findUnique({
            where: { nullifier: nullifier }
        });

        if (!existingNullifier) {
            await prisma.nullifier.create({
                data: { nullifier: nullifier }
            });
            const commitment = getCommitment(proof);
            await updateMerkleTree(commitment);
        } else {
            console.log(`Nullifier ${nullifier} already exists`);
        }
    } else {
        console.log("merkle proof of proof is not valid");
    }
}

async function updateMerkleTree(commitment: string) {
    const currentTree = await prisma.tree.findUnique({
        where: { id: "current" }
    });

    let imt = new LeanIMT((a, b) => poseidon2([a, b]));
    if (currentTree) {
        imt.import(currentTree.tree);
    }

    imt.insert(BigInt(commitment));
    const serializedTree = imt.export();

    await prisma.tree.upsert({
        where: { id: "current" },
        update: { tree: serializedTree },
        create: { id: "current", tree: serializedTree }
    });
}
