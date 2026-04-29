import fs from 'fs'
import { check_if_ready_asap } from '../helper/helper.js'


const notes = JSON.parse(
    fs.readFileSync(new URL('./notes.json', import.meta.url))
);

async function main() {

    const csvHeader = "Contact Id,Tag Added,Should have Added,Status"
    let csvData = ''

    const effected = [];

    for (const note of notes) {
        const { contactId, addTag } = note
        if (note.note) {
            
            let response = ''
            let csv = `${contactId},${addTag},no,not-effected\n`
            if (addTag === 'yes') {
                // call api
                const exists = check_if_ready_asap(note.note);
                csv = `${contactId},${addTag},${exists},${exists === 'question found but answer not found - add tag' ? 'not-effected' : 'effected'}\n`
                if(exists) effected.push(contactId)
            }


            csvData = `${csvData}${csv}`
        }
    }

    fs.writeFile('output.csv', `${csvHeader}\n${csvData}`, (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });

    console.log(effected.length)
    // const respult = check_if_ready_asap(notes[1].note)

    // console.log('is ready - ', respult)
}


main()