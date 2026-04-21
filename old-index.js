import 'dotenv/config'
import axios from 'axios'
import fs from 'fs'
import pLimit from 'p-limit'
import { check_if_ready_asap, wait } from './helper.js'
import { getContactNote, getContacts } from './api.js'

const TOKEN = process.env.ACCESS_KEY
const ENDPOINT = process.env.API_URI
const LOCATIONID = process.env.LOCATION_ID

const limit = pLimit(8);



async function main() {
    try {
        let totalRecord = 500
        let searchAfter = []
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        const csvHeader = "Email,Notes,Tag Added"
        let csvData = ''

        const allContacts = []

        do {
            const {contacts, total} = await getContacts(searchAfter)
            totalRecord = total;
            
            allContacts.push(...contacts)

            searchAfter = contacts[contacts.length - 1].searchAfter

            for (const contact of contacts) {
                const notes = await getContactNote(contact.id)
                let exists = false;
                if (notes.data.notes[0]) {
                    exists = check_if_ready_asap(notes.data.notes[0])
                }

                const csv = `${contact.email},${JSON.stringify(notes.data.notes[0])},${exists}\n`
                csvData = `${csvData}${csv}`
                fs.writeFile('output.csv', `${csvHeader}\n${csvData}`, (err) => {
                    if (err) throw err;
                    console.log('CSV file saved!');
                });
            }

            await wait(10000)


        } while (allContacts.length < totalRecord)



    } catch (e) {
        console.log('error', e);
    }
}

main()