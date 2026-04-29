import notes from './notes.json' assert { type: 'json' };
import { check_if_ready_asap, wait } from '../helper/elper.js'
import { addTagToContact } from '../helper/api.js'
import fs from 'fs'

const BATCH_SIZE = 10;

async function main() {

    const csvHeader = "Contact Id,Tag To Add,Status"
    let csvData = ''

    const totalBatches = Math.ceil(notes.length / BATCH_SIZE);

    for (let i = 0; i < notes.length; i += BATCH_SIZE) {
        const batch = notes.slice(i, i + BATCH_SIZE);
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`Starting batch ${batchIndex}/${totalBatches} (items ${i + 1}–${i + batch.length})`);

        const batchResults = await Promise.all(
            batch.map(async (note) => {
                const { contactId, addTag } = note
                if (note.note) {
                    const exists = check_if_ready_asap(note.note);
                    let response = ''
                    if (!exists) {
                        // call api
                        response = await addTagToContact(contactId)
                    } else {
                        response = 'text missing'
                    }

                    const csv = `${contactId},${addTag},${JSON.stringify(response)}\n`
                    csvData = `${csvData}${csv}`
                    fs.writeFile('output.csv', `${csvHeader}\n${csvData}`, (err) => {
                        if (err) throw err;
                        console.log('CSV file saved!');
                    });
                }
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