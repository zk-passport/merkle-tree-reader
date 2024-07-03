import { getNullifier, verifyProofs, Proof, check_merkle_root, getCommitment } from "@proofofpassport/sdk";
import { merkle_root_csca } from "./constants";
import fs from "fs";
import path from "path";
import { poseidon2 } from "poseidon-lite";
import { LeanIMT } from "@zk-kit/lean-imt";


export async function register(proof: Proof, proof_csca: Proof) {
    const result = await verifyProofs(proof, proof_csca);
    console.log(result);
    const checkRoot = check_merkle_root(merkle_root_csca, proof_csca);
    console.log(checkRoot);
    if (checkRoot && result) {

        // check if nullifier exists
        const nullifier = getNullifier(proof);
        const nullifiersPath = path.join(process.cwd(), 'nullifiers.json');
        let nullifiers = {};
        if (fs.existsSync(nullifiersPath)) {
            const data = fs.readFileSync(nullifiersPath, 'utf8');
            nullifiers = JSON.parse(data);
        }

        if (!nullifiers.hasOwnProperty(nullifier)) {
            (nullifiers as Record<string, boolean>)[nullifier] = true;
            fs.writeFileSync(nullifiersPath, JSON.stringify(nullifiers, null, 2));
            console.log(`Nullifier ${nullifier} added to nullifiers.json`);
            // update the merkle tree with the commitment
            const commitment = getCommitment(proof);
            updateMerkleTree(commitment);
        } else {
            console.log(`Nullifier ${nullifier} already exists in nullifiers.json`);
        }
    }
    else {
        console.log("merkle proof of proof is not valid");
    }
}


export async function updateMerkleTree(commitment: string) {
    let imt = new LeanIMT((a, b) => poseidon2([a, b]));
    const treePath = path.join(process.cwd(), 'serialized_tree.json');
    let data = "";
    if (fs.existsSync(treePath)) {
        data = fs.readFileSync(treePath, 'utf8');
    }
    if (data !== "") {
        imt.import(data);
    }
    imt.insert(BigInt(commitment));
    const serializedTree = imt.export();
    fs.writeFileSync(treePath, serializedTree);
}
