import fs from 'fs';
import { EventsData } from '../constants';
import { startblock } from '../constants'

export function readEvents() {
    let eventsData: EventsData = {};
    if (fs.existsSync('events.json')) {
        eventsData = JSON.parse(fs.readFileSync('events.json', 'utf8')) as EventsData;
    }
    return eventsData;
}

export function getLastEventBlockNumber(): number {
    try {
        const eventsData = JSON.parse(fs.readFileSync('events.json', 'utf8'));
        const lastEventKey = Object.keys(eventsData).pop();
        console.log(`Last event key: ${lastEventKey}`);
        if (lastEventKey !== undefined) {
            console.log(`Last event block number: ${eventsData[lastEventKey]?.blockNumber ?? 'undefined'}`);
        }

        if (lastEventKey) {
            return eventsData[lastEventKey].blockNumber;
        } else {
            console.error("No events found in events.json");
            return startblock;
        }

    } catch (error) {
        console.error("Error reading or parsing events.json:", error);
        return startblock;
    }
}

export function cleanEvents() {
    fs.writeFileSync('events.json', '{}');
}


