import { createTree, getChainMerkleRoot, serializeTree } from '../tree';
import { LeanIMT } from '@zk-kit/lean-imt';
import { cleanEvents, readEvents } from '../manageData';
import { getLastEventBlockNumber } from '../manageData';
import { getPastEvents } from '../getPastEvents';
import { EventsData } from '../constants';

async function handleClientRequest() {
    const merkleRootFromContract = BigInt(await getChainMerkleRoot());
    console.log(`Merkle Root from the smart contract: ${merkleRootFromContract}`);
    let events: EventsData = readEvents();
    let imt: LeanIMT = createTree(events);
    let localRoot = imt.root;
    let lastEventBlock: number;
    console.log(`Merkle Root from the tree: ${localRoot}`);

    if (merkleRootFromContract === localRoot) {
        console.log("\x1b[32m", "Merkle roots match.", "\x1b[0m");
        return true
    } else {
        console.log("Merkle roots do not match.");
        lastEventBlock = getLastEventBlockNumber();
        console.log(`Last event block number: ${lastEventBlock}`);
        events = await getPastEvents(lastEventBlock);
        imt = createTree(events);
        if (imt.root === merkleRootFromContract) {
            console.log("\x1b[32m", "Merkle roots match after adding past events", "\x1b[0m");
            serializeTree(imt);
            return true
        } else {
            console.log("\x1b[33m", "Merkle roots do not match after adding past events, erase the tree and recreate it", "\x1b[0m");
            cleanEvents();
            events = await getPastEvents();
            imt = createTree(events);
            localRoot = imt.root;
            console.log(`Merkle Root from the tree: ${localRoot}`);
            if (imt.root === merkleRootFromContract) {
                console.log("\x1b[32m", "Merkle roots match after adding past events", "\x1b[0m");
                serializeTree(imt);
                return true
            } else {
                console.log("\x1b[31m", "Merkle roots do not match after adding past events, erase the tree and recreate it", "\x1b[0m");
            }
        }
    }
}

handleClientRequest().catch(error => {
    console.error("Failed to fetch or compare Merkle roots:", error);
});