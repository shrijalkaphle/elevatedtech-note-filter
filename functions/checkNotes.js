import contacts from './contact.json' assert { type: 'json' };
import { check_if_ready_asap, wait } from '../helper/helper.js'
import { getContactNote } from '../helper/api.js'
import fs from 'fs'

const BATCH_SIZE = 10;

async function main() {
    if (!contacts.length) return

    const notes = []
    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
        const batch = contacts.slice(i, i + BATCH_SIZE);
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`Starting batch ${batchIndex}/${totalBatches} (items ${i + 1}–${i + batch.length})`);

        const batchResults = await Promise.all(
            batch.map(async (contact) => {
                const note = await getContactNote(contact.id);

                let exists = false;
                if (note) {
                    exists = check_if_ready_asap(note);
                }

                return {
                    contactId: contact.id,
                    note: note,
                    addTag: exists ? 'no' : 'yes'
                };
            })
        );

        notes.push(...batchResults);

        console.log(`Finished batch ${batchIndex}/${totalBatches}`);

        // wait after each batch (skip delay after last batch if you want)
        if (i + BATCH_SIZE < contacts.length) {
            await wait(1000); // 1 second pause (adjust as needed)
        }
    }

    fs.writeFile('notes.json', JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        console.log('JSON file saved!');
    });
}

main()