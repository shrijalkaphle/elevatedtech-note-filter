import fs from 'fs'
import { check_if_note_is_related, check_if_contact_is_ready, wait } from './helper/helper.js'

const contacts = JSON.parse(
    fs.readFileSync(new URL('./misc/notes.json', import.meta.url))
);



let result = []

async function main() {
    // const csvHeader = "ContactId,Note,Message,Status"
    // let csvData = ''
    const BATCH_SIZE = 10000

    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
        const batch = contacts.slice(i, i + BATCH_SIZE);
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`Starting batch ${batchIndex}/${totalBatches} (items ${i + 1}–${i + batch.length})`);

        const batchResults = await Promise.all(
            batch.map(async (_note) => {
                const { contactId, note } = _note
                // let csv = ''

                // check if note exists and question exists
                const hasRelatedNote = check_if_note_is_related(note)
                if (!hasRelatedNote) {
                    // csv = `${contactId},${note ? JSON.stringify(note)?.replace(/,/g, '.') : 'no note'},note doesnt have question,false\n`
                    result.push({
                        contactId,
                        note,
                        message: 'note doesnt have question',
                        status: false
                    })
                } else {
                    // check if contact ready to start immidiately
                    const readyToStart = check_if_contact_is_ready(note);
                    if (readyToStart) {
                        // csv = `${contactId},${JSON.stringify(note).replace(/,/g, '.')},not ready ASAP,false\n`
                        result.push({
                            contactId,
                            note,
                            message: 'not ready ASAP',
                            status: true
                        })
                    } else {
                        // csv = `${contactId},${JSON.stringify(note).replace(/,/g, '.')},ready ASAP,true\n`
                        result.push({
                            contactId,
                            note,
                            message: 'ready ASAP',
                            status: false
                        })
                    }
                }

                // csvData = `${csvData}${csv}`
            })
        );

        console.log(`Finished batch ${batchIndex}/${totalBatches}`);

        // wait after each batch (skip delay after last batch if you want)
        if (i + BATCH_SIZE < contacts.length) {
            await wait(1000); // 1 second pause (adjust as needed)
        }
    }

    // fs.writeFile('output.csv', `${csvHeader}\n${csvData}`, (err) => {
    //     if (err) throw err;
    //     console.log('CSV file saved!');
    // });
    fs.writeFile('status.json', JSON.stringify(result, null, 2), (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });
}

function status() {
    const status = JSON.parse(
        fs.readFileSync(new URL('./status.json', import.meta.url))
    );

    const tagAdding = []

    status.map(stat => {
        if (stat.status === true) {
            tagAdding.push(stat)
        }
    })

    console.log(tagAdding.length)
    fs.writeFile('tagAdding.json', JSON.stringify(tagAdding, null, 2), (err) => {
        if (err) throw err;
        console.log('json file saved!');
    });
}

async function addTag() {
    const contacts = JSON.parse(
        fs.readFileSync(new URL('./not-ready-asap.json', import.meta.url))
    );

    const BATCH_SIZE = 100
    const report = []
    // contacts.map(cont => {
    //     const note = cont.note
    //     const hasRelatedNote = check_if_note_is_related(note)
    //     if(hasRelatedNote) {
    //         report.push(cont)
    //     }
    // })
    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
        const batch = contacts.slice(i, i + BATCH_SIZE);
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`Starting batch ${batchIndex}/${totalBatches} (items ${i + 1}–${i + batch.length})`);

        const batchResults = await Promise.all(
            batch.map(async (contact) => {
                const { contactId, note, status } = contact

                if (status) {
                    // add tag
                    report.push({
                        contactId,
                        note,
                        tagAdded: true
                    })
                } else {
                    report.push({
                        contactId,
                        note,
                        tagAdded: false
                    })
                }

                // fs.writeFile('tag-add-status.json', JSON.stringify(report, null, 2), (err) => {
                //     if (err) throw err;
                // });


            })
        )
    }

    console.log(report.length)
}

async function statv2() {
    const stat = JSON.parse(
        fs.readFileSync(new URL('./tag-add-status.json', import.meta.url))
    );

    console.log(stat.length)
}

// main()
// status()
// addTag()
statv2()