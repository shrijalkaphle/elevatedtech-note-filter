import { check_if_ready_asap, wait } from '../helper/helper.js'
import { removeTagFromContact } from '../helper/api.js'
import fs from 'fs'

const BATCH_SIZE = 10;

const notes = JSON.parse(
    fs.readFileSync(new URL('./export.json', import.meta.url))
);

async function main() {
    // const response = await removeTagFromContact('syElpubMkC254hq6nL4K')
    // return

    const totalBatches = Math.ceil(notes.length / BATCH_SIZE);

    for (let i = 0; i < notes.length; i += BATCH_SIZE) {
        const batch = notes.slice(i, i + BATCH_SIZE);
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`Starting batch ${batchIndex}/${totalBatches} (items ${i + 1}–${i + batch.length})`);

        const batchResults = await Promise.all(
            batch.map(async (note) => {
                // const { contactId } = note
                const response = await removeTagFromContact(note['Contact Id'])
            })
        );

        console.log(`Finished batch ${batchIndex}/${totalBatches}`);

        // wait after each batch (skip delay after last batch if you want)
        if (i + BATCH_SIZE < notes.length) {
            await wait(1000); // 1 second pause (adjust as needed)
        }
    }
}

main()